import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import * as React from 'react';
import { translate } from 'react-i18next';
import { TranslateHocProps } from 'react-i18next/src/translate';
import { createBrowserHistory } from 'history';

import { Election, Candidate } from '../../../../interfaces';
import { shuffleArray } from '../../../../utils/helpers';
import { Page } from '../../../../components/page';
import PrefElecBallot from './components/PrefElecBallot';
import PrefElecReview from './components/PrefElecReview';
import Receipt from './components/Receipt';
import ErrorReceipt from './components/ErrorReceipt';
import Loading from '../../../../components/loading';

const castVoteQuery = gql`
  mutation castVote($voterId: UUID!, $ballot: JSONString!) {
    vote(voterId: $voterId, ballot: $ballot) {
      ok
    }
  }
`;

const getSignedInPersonId = gql`
  query {
    signedInPerson @client {
      personId
    }
  }
`;

const getSelectedPollbook = gql`
  query {
    voter @client {
      selectedPollBookID
      notInPollBookJustification
    }
  }
`;

const getVoterId = gql`
  query getVoterId($personId: UUID!, $pollbookId: UUID!) {
    voter(personId: $personId, pollbookId: $pollbookId) {
      id
    }
  }
`;

function moveArrayItem(arr: any[], oldIndex: number, newIndex: number) {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
}

interface IProps extends TranslateHocProps {
  election: Election;
  electionName: any;
}

interface IState {
  selectedCandidates: Candidate[];
  shuffledCandidates: Candidate[];
  isReviewingBallot: boolean;
  isBlankVote: boolean;
}

class PrefElecVote extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isReviewingBallot: false,
      isBlankVote: false,
      selectedCandidates: [],
      shuffledCandidates: shuffleArray(props.election.lists[0].candidates),
    };
    this.handleAddCandidate = this.handleAddCandidate.bind(this);
    this.handleMoveCandidate = this.handleMoveCandidate.bind(this);
    this.handleRemoveCandidate = this.handleRemoveCandidate.bind(this);
    this.handleResetBallot = this.handleResetBallot.bind(this);
    this.handleReviewBallot = this.handleReviewBallot.bind(this);
    this.handleBlankVote = this.handleBlankVote.bind(this);
    this.handleGoBackToBallot = this.handleGoBackToBallot.bind(this);
  }
  public render() {
    const unselectedCandidates = this.state.shuffledCandidates.filter(
      c => this.state.selectedCandidates.indexOf(c) === -1
    );
    const { i18n } = this.props;
    let lang = 'nb';
    if (i18n && i18n.language) {
      lang = i18n.language;
    }

    return (
      <Page header={this.props.electionName[lang]}>
        <Query query={getSignedInPersonId}>
          {getSignedInPersonIdResponse => {
            if (getSignedInPersonIdResponse.loading) {
              return <Loading />;
            } else if (getSignedInPersonIdResponse.error) {
              // TODO: Handle error properly
              return 'Error: not signed in!';
            } else {
              return (
                <Query query={getSelectedPollbook}>
                  {getSelectedPollbookResponse => {
                    if (getSelectedPollbookResponse.loading) {
                      return <Loading />;
                    } else if (getSelectedPollbookResponse.error) {
                      return 'Error: ' + getSelectedPollbookResponse.error;
                      // TODO: Handle error properly
                    } else {
                      return (
                        <Query
                          query={getVoterId}
                          variables={{
                            personId:
                              getSignedInPersonIdResponse.data.signedInPerson
                                .personId,
                            pollbookId:
                              getSelectedPollbookResponse.data.voter
                                .selectedPollBookID,
                          }}
                        >
                          {getVoterIdResponse => {
                            if (getVoterIdResponse.loading) {
                              return <Loading />;
                            } else if (getVoterIdResponse.error) {
                              const history = createBrowserHistory();
                              history.goBack();
                              return 'Error: ' + getVoterIdResponse.error;
                              // TODO: Handle error properly
                            } else {
                              if (this.state.isReviewingBallot) {
                                return (
                                  <Mutation mutation={castVoteQuery}>
                                    {(castVote, { loading, error, data }) => {
                                      const vote = (ballot: string) => {
                                        castVote({
                                          variables: {
                                            voterId:
                                              getVoterIdResponse.data.voter.id,
                                            ballot,
                                          },
                                        });
                                      };
                                      if (loading) {
                                        return <Loading />;
                                      } else if (error) {
                                        return <ErrorReceipt />;
                                      } else if (data) {
                                        return <Receipt />;
                                      } else {
                                        return (
                                          <PrefElecReview
                                            selectedCandidates={
                                              this.state.selectedCandidates
                                            }
                                            isBlankVote={this.state.isBlankVote}
                                            onGoBackToBallot={
                                              this.handleGoBackToBallot
                                            }
                                            onSubmitBallot={() => {
                                              if (this.state.isBlankVote) {
                                                // Submitting blank vote
                                                vote(
                                                  JSON.stringify({
                                                    blankVote: true,
                                                    pollbookId:
                                                      getSelectedPollbookResponse
                                                        .data.voter
                                                        .selectedPollBookID,
                                                    notInPollBookJustification:
                                                      getSelectedPollbookResponse
                                                        .data.voter
                                                        .notInPollBookJustification,
                                                  })
                                                );
                                              } else {
                                                const filter = (
                                                  x: Candidate[]
                                                ) =>
                                                  x.map(y => {
                                                    const { id } = y;
                                                    return { id };
                                                  });

                                                vote(
                                                  JSON.stringify({
                                                    selectedCandidates: filter(
                                                      this.state
                                                        .selectedCandidates
                                                    ),
                                                    pollbookId:
                                                      getSelectedPollbookResponse
                                                        .data.voter
                                                        .selectedPollBookID,
                                                    notInPollBookJustification:
                                                      getSelectedPollbookResponse
                                                        .data.voter
                                                        .notInPollBookJustification,
                                                  })
                                                );
                                              }
                                            }}
                                          />
                                        );
                                      }
                                    }}
                                  </Mutation>
                                );
                              } else {
                                return (
                                  <PrefElecBallot
                                    selectedCandidates={
                                      this.state.selectedCandidates
                                    }
                                    unselectedCandidates={
                                      unselectedCandidates === undefined
                                        ? []
                                        : unselectedCandidates
                                    }
                                    election={this.props.election}
                                    onAddCandidate={this.handleAddCandidate}
                                    onRemoveCandidate={
                                      this.handleRemoveCandidate
                                    }
                                    onMoveCandidate={this.handleMoveCandidate}
                                    onResetBallot={this.handleResetBallot}
                                    onBlankVote={this.handleBlankVote}
                                    onReviewBallot={this.handleReviewBallot}
                                  />
                                );
                              }
                            }
                          }}
                        </Query>
                      );
                    }
                  }}
                </Query>
              );
            }
          }}
        </Query>
      </Page>
    );
  }
  private handleAddCandidate(candidate: Candidate) {
    this.setState(currState => ({
      selectedCandidates: currState.selectedCandidates.concat([candidate]),
    }));
  }

  private handleRemoveCandidate(candidate: Candidate) {
    const selectedCandidates = this.state.selectedCandidates.filter(
      c => c !== candidate
    );
    this.setState({ selectedCandidates });
  }

  private handleMoveCandidate(oldIndex: number, newIndex: number) {
    const emptyArray: Candidate[] = [];
    const arrayCopy: Candidate[] = emptyArray.concat(
      this.state.selectedCandidates
    );
    moveArrayItem(arrayCopy, oldIndex, newIndex);
    this.setState({ selectedCandidates: arrayCopy });
  }

  private handleResetBallot() {
    this.setState({ selectedCandidates: [] });
  }

  private handleReviewBallot() {
    this.setState({ isReviewingBallot: true });
  }

  private handleGoBackToBallot() {
    this.setState({
      isReviewingBallot: false,
      isBlankVote: false,
    });
  }

  private handleBlankVote() {
    this.setState({ isBlankVote: true }, this.handleReviewBallot);
  }
}

export default translate()(PrefElecVote);
