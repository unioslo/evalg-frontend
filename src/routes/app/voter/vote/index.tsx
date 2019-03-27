import React from 'react';
import gql from 'graphql-tag';
import { Query, WithApolloClient, withApollo } from 'react-apollo';
import { withTranslation, WithTranslation } from 'react-i18next';

import {
  ElectionGroup,
  Election,
  IMutationResponse,
  QueryResponse,
  ViewerResponse,
  IVoter,
} from '../../../../interfaces';

import VotingStepper, { VotingStep } from './components/VotingStepper';
import VoterGroupSelect from '../voterGroupSelect';
import Loading from '../../../../components/loading';
import { Page } from '../../../../components/page';
import { orderMultipleElections } from '../../../../utils/processGraphQLData';
import PrefElecVote from './PrefElecVote';
import MajorityVote from './MajorityVote';
import Receipt from './components/Receipt';
import Error from './components/Error';
import { getSignedInPersonId } from '../../../../common-queries';

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

const submitVoteMutation = gql`
  mutation submitVote($voterId: UUID!, $ballot: JSONString!) {
    vote(voterId: $voterId, ballot: $ballot) {
      ok
    }
  }
`;

const addVoterMutation = gql`
  mutation addVoter($personId: UUID!, $pollbookId: UUID!) {
    addVoter(personId: $personId, pollbookId: $pollbookId) {
      id
    }
  }
`;

export enum BallotStep {
  FillOutBallot,
  ReviewBallot,
}

type VoteResponse = {
  vote: IMutationResponse;
};

type AddVoterResponse = {
  addVoter: IVoter;
};

interface IProps extends WithTranslation {
  electionGroupId: string;
}

interface IState {
  currentStep: VotingStep;
  voteElection: Election | null;
  selectedPollBookId: string;
  voterId: string;
  personId: string;
  notInPollBookJustification: string;
  errorOccurred: boolean;
}

class VotingPage extends React.Component<WithApolloClient<IProps>, IState> {
  scrollToDivRef: React.RefObject<HTMLDivElement> = React.createRef();

  readonly state: IState = {
    currentStep: VotingStep.Step1SelectVoterGroup,
    voteElection: null,
    selectedPollBookId: '',
    voterId: '',
    personId: '',
    notInPollBookJustification: '',
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

  showError = () => {
    this.setState({ errorOccurred: true }, this.scrollToTop);
  };

  handleProceedFromSelectVoterGroup = (
    activeElections: Election[],
    selectedElectionIndex: number,
    selectedPollBookId: string,
    voterId: string,
    notInPollBookJustification: string
  ) => {
    this.setState(
      {
        voteElection: activeElections[selectedElectionIndex],
        selectedPollBookId,
        voterId,
        notInPollBookJustification,
      },
      this.goToStep2
    );
  };

  async handleSubmitVote(ballotData: object) {
    let voterId = '';
    if (this.state.voterId) {
      voterId = this.state.voterId;
    } else {
      const handleSuccess = (p: QueryResponse<ViewerResponse>) => {
        this.setState({ personId: p.data.signedInPerson.personId });
      };
      const handleFailure = (error: any) => {};

      await getSignedInPersonId(
        this.props.client,
        handleSuccess,
        handleFailure
      );

      await this.props.client
        .mutate<AddVoterResponse>({
          mutation: addVoterMutation,
          variables: {
            personId: this.state.personId,
            pollbookId: this.state.selectedPollBookId,
            reason: this.state.notInPollBookJustification,
          },
        })
        .then(result => {
          if (result.errors) {
            this.showError();
          } else if (result.data) {
            voterId = result.data.addVoter.id;
          }
        })
        .catch(error => {
          this.showError();
        });
    }

    const voteData = {
      electionId: this.state.voteElection ? this.state.voteElection.id : null,
      selectedPollbookId: this.state.selectedPollBookId,
      ballotData,
    };
    const voteDataJSON = JSON.stringify(voteData);

    await this.props.client
      .mutate<VoteResponse>({
        mutation: submitVoteMutation,
        variables: {
          voterId: voterId,
          ballot: voteDataJSON,
        },
      })
      .then(result => {
        const response = result && result.data && result.data.vote;

        if (!response) {
          this.showError();
        } else {
          this.goToStep4();
        }
      })
      .catch(error => {
        this.showError();
      });
  }

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
                      voterId,
                      notInPollBookJustification
                    ) =>
                      this.handleProceedFromSelectVoterGroup(
                        activeElections,
                        selectedElectionIndex,
                        selectedPollBookID,
                        voterId,
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
