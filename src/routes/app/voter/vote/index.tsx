import React from 'react';
import { gql } from '@apollo/client';
import { WithApolloClient, withApollo } from '@apollo/client/react/hoc';
import { Query } from '@apollo/client/react/components';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

import Loading from 'components/loading';
import { Page } from 'components/page';
import { orderMultipleElections } from 'utils/processGraphQLData';
import { submitVote } from 'utils/voting';
import { Election, IVoter } from 'interfaces';
import { BallotStep } from './utils';

import ListVote from './listvote';
import PrefElecVote from './PrefElecVote';
import MajorityVote from './MajorityVote';
import PollVote from './PollVote';
import Receipt from './components/Receipt';
import Error from './components/Error';
import VotingStepper, { VotingStep } from './components/VotingStepper';
import VoterGroupSelect from '../voterGroupSelect';

const getElectionGroupVotingData = gql`
  query ElectionGroupVotingData($id: UUID!) {
    electionGroup(id: $id) {
      id
      name
      type
      elections {
        id
        name
        meta
        active
        status
        start
        end
        mandatePeriodStart
        mandatePeriodEnd
        informationUrl
        pollbooks {
          id
          name
        }
        lists {
          id
          name
          description
          informationUrl
          candidates {
            id
            name
            meta
            informationUrl
            priority
            preCumulated
          }
        }
      }
    }
  }
`;

const votingStepTranslateKey = {
  1: 'voter.stepperStep1',
  2: 'voter.stepperStep2',
  3: 'voter.stepperStep3',
  4: 'voter.stepperStep4',
};

interface IProps extends WithTranslation {
  electionGroupId: string;
}

interface IState {
  currentStep: VotingStep;
  voteElection: Election | null;
  selectedPollBookId: string;
  voter: IVoter | null;
  personId: string;
  notInPollBookJustification: string;
  isSubmittingVote: boolean;
  errorOccurred: boolean;
}

class VotingPage extends React.Component<WithApolloClient<IProps>, IState> {
  scrollToDivRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: IProps) {
    super(props);
    this.state = {
      currentStep: VotingStep.Step1SelectVoterGroup,
      voteElection: null,
      selectedPollBookId: '',
      voter: null,
      personId: '',
      notInPollBookJustification: '',
      isSubmittingVote: false,
      errorOccurred: false,
    };
  }

  componentDidMount() {
    this.scrollToTop();
  }

  async handleSubmitVote(ballotData: object) {
    const { client } = this.props;
    const { notInPollBookJustification, selectedPollBookId, voter } =
      this.state;
    this.setState({ isSubmittingVote: true });

    if (!client) {
      this.showErrorScreen();
      return;
    }
    try {
      await submitVote(
        ballotData,
        client,
        selectedPollBookId,
        notInPollBookJustification,
        voter
      );
    } catch (error: any) {
      this.showErrorScreen();
      if (error.message) console.error(error.message);
      return;
    }
    this.goToStep4();
    this.setState({ isSubmittingVote: false });
  }

  scrollToTop = () => {
    if (this.scrollToDivRef.current) {
      this.scrollToDivRef.current.scrollIntoView();
    }
  };

  goToStep1 = () => {
    this.setState(
      { currentStep: VotingStep.Step1SelectVoterGroup },
      this.scrollToTop
    );
  };

  goToStep2 = () => {
    this.setState(
      { currentStep: VotingStep.Step2FillBallot },
      this.scrollToTop
    );
  };

  goToStep3 = () => {
    this.setState(
      { currentStep: VotingStep.Step3ReviewBallot },
      this.scrollToTop
    );
  };

  goToStep4 = () => {
    this.setState({ currentStep: VotingStep.Step4Receipt }, this.scrollToTop);
  };

  showErrorScreen = () => {
    this.setState({ errorOccurred: true }, this.scrollToTop);
  };

  handleProceedFromSelectVoterGroup = (
    activeElections: Election[],
    voteElectionIndex: number,
    selectedPollBookId: string,
    voter: IVoter | null,
    notInPollBookJustification: string
  ) => {
    this.setState(
      {
        voteElection: activeElections[voteElectionIndex],
        selectedPollBookId,
        voter,
        notInPollBookJustification,
      },
      this.goToStep2
    );
  };

  render() {
    const { electionGroupId, i18n, t } = this.props;
    const { currentStep, errorOccurred, isSubmittingVote, voteElection } =
      this.state;
    const lang = i18n ? i18n.language : 'nb';

    const ballotStep: BallotStep =
      currentStep === VotingStep.Step3ReviewBallot
        ? BallotStep.ReviewBallot
        : BallotStep.FillOutBallot;

    const currentStepText = t(votingStepTranslateKey[currentStep]);
    return (
      <Query
        query={getElectionGroupVotingData}
        variables={{ id: electionGroupId }}
      >
        {(result: any) => {
          const { data, loading, error } = result;
          if (loading) {
            return <Loading />;
          }
          if (error) {
            return <div>Error</div>;
          }

          const { electionGroup } = data;
          const electionGroupName: string = electionGroup.name[lang];
          const activeElections = orderMultipleElections(
            electionGroup.elections
          ).filter((e) => e.active);

          let VotingComponent: any;
          if (voteElection) {
            const { candidateType, countingRules } = voteElection.meta;
            const { voting } = voteElection.meta.ballotRules;

            if (voting === 'rank_candidates') {
              if (
                candidateType === 'single' ||
                candidateType === 'single_team'
              ) {
                if (countingRules.method === 'uio_mv') {
                  VotingComponent = MajorityVote;
                } else if (countingRules.method === 'uio_stv') {
                  VotingComponent = PrefElecVote;
                }
              } else {
                return <div>Unknown meta.candidateType: {candidateType}</div>;
              }
            } else if (voting === 'list') {
              VotingComponent = ListVote;
            } else if (voting === 'no_rank') {
              if (
                countingRules.method === 'mntv' ||
                countingRules.method === 'poll'
              ) {
                VotingComponent = MajorityVote;
              }
            } else if (voting === 'poll') {
              if (candidateType === 'single_team') {
                VotingComponent = MajorityVote;
              } else {
                VotingComponent = PollVote;
              }
            } else {
              return <div>Unknown meta.ballotRules.voting type: {voting}</div>;
            }
          }

          return errorOccurred ? (
            <Error />
          ) : (
            <>
              <VotingStepper
                currentStep={currentStep}
                currentStepText={currentStepText}
                onClickStep1={this.goToStep1}
                onClickStep2={this.goToStep2}
                scrollToDivRef={this.scrollToDivRef}
                disabled={isSubmittingVote}
              />
              <Page header={electionGroupName}>
                <Helmet>
                  <title>{`${currentStepText} - ${electionGroupName}`}</title>
                </Helmet>
                {currentStep === VotingStep.Step1SelectVoterGroup && (
                  <VoterGroupSelect
                    electionGroupType={electionGroup.type}
                    activeElections={activeElections}
                    onProceed={(
                      voteElectionIndex,
                      selectedPollBookID,
                      voter,
                      notInPollBookJustification
                    ) =>
                      this.handleProceedFromSelectVoterGroup(
                        activeElections,
                        voteElectionIndex,
                        selectedPollBookID,
                        voter,
                        notInPollBookJustification
                      )
                    }
                  />
                )}
                {(currentStep === VotingStep.Step2FillBallot ||
                  currentStep === VotingStep.Step3ReviewBallot) &&
                  voteElection && (
                    <VotingComponent
                      election={voteElection}
                      ballotStep={ballotStep}
                      onProceedToReview={this.goToStep3}
                      onGoBackToSelectVoterGroup={this.goToStep1}
                      onGoBackToBallot={this.goToStep2}
                      onSubmitVote={this.handleSubmitVote.bind(this)}
                      isSubmittingVote={isSubmittingVote}
                    />
                  )}
                {currentStep === VotingStep.Step4Receipt && <Receipt />}
              </Page>
            </>
          );
        }}
      </Query>
    );
  }
}

export default withTranslation()(withApollo<IProps, IState>(VotingPage));
