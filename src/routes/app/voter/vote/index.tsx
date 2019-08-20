import React from 'react';
import gql from 'graphql-tag';
import { Query, WithApolloClient, withApollo } from 'react-apollo';
import { withTranslation, WithTranslation } from 'react-i18next';

import Loading from 'components/loading';
import { Page } from 'components/page';
import { orderMultipleElections } from 'utils/processGraphQLData';
import { submitVote } from 'utils/voting';
import { ElectionGroup, Election, IVoter } from 'interfaces';

import PrefElecVote from './PrefElecVote';
import MajorityVote from './MajorityVote';
import Receipt from './components/Receipt';
import Error from './components/Error';
import VotingStepper, { VotingStep } from './components/VotingStepper';
import VoterGroupSelect from '../voterGroupSelect';
import Helmet from 'react-helmet';

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
}

export enum BallotStep {
  FillOutBallot,
  ReviewBallot,
}

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

  readonly state: IState = {
    currentStep: VotingStep.Step1SelectVoterGroup,
    voteElection: null,
    selectedPollBookId: '',
    voter: null,
    personId: '',
    notInPollBookJustification: '',
    isSubmittingVote: false,
    errorOccurred: false,
  };

  componentDidMount() {
    this.scrollToTop();
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

  async handleSubmitVote(ballotData: object) {
    this.setState({ isSubmittingVote: true });
    try {
      await submitVote(
        ballotData,
        this.props.client,
        this.state.selectedPollBookId,
        this.state.notInPollBookJustification,
        this.state.voter
      );
    } catch (error) {
      this.showErrorScreen();
      if (error.message) console.error(error.message);
      return;
    }
    this.goToStep4();
    this.setState({ isSubmittingVote: false });
  }

  render() {
    const { currentStep } = this.state;
    const lang = this.props.i18n ? this.props.i18n.language : 'nb';

    const ballotStep: BallotStep =
      currentStep === VotingStep.Step3ReviewBallot
        ? BallotStep.ReviewBallot
        : BallotStep.FillOutBallot;

    const currentStepText = this.props.t(votingStepTranslateKey[currentStep])

    return (
      <Query
        query={getElectionGroupVotingData}
        variables={{ id: this.props.electionGroupId }}
      >
        {({ data, loading, error, client }) => {
          if (loading) {
            return <Loading />;
          }
          if (error) {
            return 'Error';
          }

          const electionGroup: ElectionGroup = data.electionGroup;
          const electionGroupName: string = electionGroup.name[lang];
          const activeElections = orderMultipleElections(
            electionGroup.elections
          ).filter(e => e.active);

          let VotingComponent: any;
          if (this.state.voteElection) {
            const voteElection = this.state.voteElection;
            const { candidateType } = voteElection.meta;
            const { voting } = voteElection.meta.ballotRules;

            if (voting === 'rank_candidates') {
              if (
                candidateType === 'single' ||
                candidateType === 'single_team'
              ) {
                // TODO: This might not be how we wan't to decide when to use majority vote ballot
                if (voteElection.lists[0].candidates.length <= 2) {
                  VotingComponent = MajorityVote;
                } else {
                  VotingComponent = PrefElecVote;
                }
              } else {
                return <div>Unknown meta.candidateType: {candidateType}</div>;
              }
            } else if (voting === 'list') {
              return <div>List election voting not implemented</div>;
            } else {
              return <div>Unknown meta.ballotRules.voting type: {voting}</div>;
            }
          }

          return this.state.errorOccurred ? (
            <Error />
          ) : (
            <>
              <VotingStepper
                currentStep={currentStep}
                currentStepText={currentStepText}
                onClickStep1={this.goToStep1}
                onClickStep2={this.goToStep2}
                scrollToDivRef={this.scrollToDivRef}
                disabled={this.state.isSubmittingVote}
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
                  this.state.voteElection && (
                    <VotingComponent
                      election={this.state.voteElection}
                      ballotStep={ballotStep}
                      onProceedToReview={this.goToStep3}
                      onGoBackToSelectVoterGroup={this.goToStep1}
                      onGoBackToBallot={this.goToStep2}
                      onSubmitVote={this.handleSubmitVote.bind(this)}
                      isSubmittingVote={this.state.isSubmittingVote}
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

export default withTranslation()(withApollo(VotingPage));
