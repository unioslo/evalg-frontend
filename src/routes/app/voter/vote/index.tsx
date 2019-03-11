import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { translate } from 'react-i18next';
import { TranslateHocProps } from 'react-i18next/src/translate';

import { ElectionGroup, Election } from '../../../../interfaces';

import VotingStepper, { VotingStep } from './components/VotingStepper';
import VoterGroupSelect from '../voterGroupSelect';
import Loading from '../../../../components/loading';
import { Page } from '../../../../components/page';
import { orderMultipleElections } from '../../../../utils/processGraphQLData';
import PrefElecVote from './PrefElecVote';
import MajorityVote from './MajorityVote';
import Receipt from './components/Receipt';

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

export enum BallotStep {
  FillOutBallot,
  ReviewBallot,
}

interface IProps extends TranslateHocProps {
  electionGroupId: string;
}

interface IState {
  currentStep: VotingStep;
  voteElection: Election | null;
  selectedPollBookId: string;
  notInPollBookJustification: string;
}

class VotingProcessPage extends React.Component<IProps, IState> {
  scrollToDivRef: React.RefObject<HTMLDivElement> = React.createRef();

  readonly state: IState = {
    currentStep: VotingStep.Step1SelectVoterGroup,
    voteElection: null,
    selectedPollBookId: '',
    notInPollBookJustification: '',
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

  handleProceedFromSelectVoterGroup = (
    activeElections: Election[],
    selectedElectionIndex: number,
    selectedPollBookId: string,
    notInPollBookJustification: string
  ) => {
    this.setState(
      {
        voteElection: activeElections[selectedElectionIndex],
        selectedPollBookId,
        notInPollBookJustification,
      },
      this.goToStep2
    );
  };

  handleSubmitVote = (ballotData: object) => {
    const voteData = {
      electionId: this.state.voteElection ? this.state.voteElection.id : null,
      selectedPollbookId: this.state.selectedPollBookId,
      notInPollbookJustification: this.state.notInPollBookJustification,
      ballotData,
    };
    const voteDataJSON = JSON.stringify(voteData, null, 2);
    console.log('Mock submitting vote:');
    console.log(voteDataJSON);
    this.goToStep4();
  };

  render() {
    const { currentStep } = this.state;
    const lang = this.props.i18n ? this.props.i18n.language : 'nb';

    const ballotStep: BallotStep =
      currentStep === VotingStep.Step3ReviewBallot
        ? BallotStep.ReviewBallot
        : BallotStep.FillOutBallot;

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
            const election = this.state.voteElection;
            const { candidateType } = election.meta;
            const { voting } = election.meta.ballotRules;

            if (voting === 'rank_candidates') {
              if (
                candidateType === 'single' ||
                candidateType === 'single_team'
              ) {
                VotingComponent = PrefElecVote;

                // TODO: This might not be how we wan't to decide when to use majority vote ballot
                if (election.lists[0].candidates.length <= 2) {
                  VotingComponent = MajorityVote;
                }
              } else {
                // Unknown election type
              }
            } else if (voting === 'list') {
              // List election
            } else {
              // Unknown election type
            }
          }

          return (
            <>
              <VotingStepper
                currentStep={currentStep}
                onClickStep1={this.goToStep1}
                onClickStep2={this.goToStep2}
                scrollToDivRef={this.scrollToDivRef}
              />
              <Page header={electionGroupName}>
                {currentStep === VotingStep.Step1SelectVoterGroup && (
                  <VoterGroupSelect
                    electionGroupType={electionGroup.type}
                    activeElections={activeElections}
                    onProceed={(
                      selectedElectionIndex,
                      selectedPollBookID,
                      notInPollBookJustification
                    ) =>
                      this.handleProceedFromSelectVoterGroup(
                        activeElections,
                        selectedElectionIndex,
                        selectedPollBookID,
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
                      onSubmitVote={this.handleSubmitVote}
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

export default translate()(VotingProcessPage);
