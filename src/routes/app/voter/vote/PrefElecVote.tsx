import React from 'react';
import { RouteComponentProps } from 'react-router';

import { Election, Candidate } from 'interfaces';
import { getCandidateArray } from 'utils/helpers';

import { BallotStep } from './utils';
import PrefElecBallot from './components/PrefElecBallot';
import PrefElecReview from './components/PrefElecReview';

function moveArrayItem(arr: any[], oldIndex: number, newIndex: number) {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1;
    /* eslint-disable no-plusplus */
    while (k--) {
      /* eslint-enable no-plusplus */
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
}

interface IProps {
  election: Election;
  ballotStep: BallotStep;
  onProceedToReview: () => void;
  onGoBackToSelectVoterGroup: () => void;
  onGoBackToBallot: () => void;
  onSubmitVote: (ballotData: object) => void;
  isSubmittingVote: boolean;
}

interface IState {
  selectedCandidates: Candidate[];
  candidateArray: Candidate[];
  isBlankVote: boolean;
}

class PrefElecVote extends React.Component<
  IProps & RouteComponentProps,
  IState
> {
  constructor(props: IProps & RouteComponentProps) {
    super(props);
    this.state = {
      candidateArray: getCandidateArray(props.election.lists[0].candidates),
      selectedCandidates: [],
      isBlankVote: false,
    };
  }

  handleAddCandidate = (candidate: Candidate) => {
    this.setState((currState) => ({
      selectedCandidates: currState.selectedCandidates.concat([candidate]),
    }));
  };

  handleRemoveCandidate = (candidate: Candidate) => {
    const selectedCandidates = this.state.selectedCandidates.filter(
      (c) => c !== candidate
    );
    this.setState({ selectedCandidates });
  };

  handleMoveCandidate = (oldIndex: number, newIndex: number) => {
    const { selectedCandidates } = this.state;
    const emptyArray: Candidate[] = [];
    const arrayCopy: Candidate[] = emptyArray.concat(selectedCandidates);
    moveArrayItem(arrayCopy, oldIndex, newIndex);
    this.setState({ selectedCandidates: arrayCopy });
  };

  handleResetBallot = () => {
    this.setState({ selectedCandidates: [] });
  };

  handleBlankVoteAndProceedToReview = () => {
    const { onProceedToReview } = this.props;
    this.setState({ isBlankVote: true }, onProceedToReview);
  };

  handleProceedToReview = () => {
    const { onProceedToReview } = this.props;
    this.setState({ isBlankVote: false }, onProceedToReview);
  };

  handleSubmitVote = () => {
    const { onSubmitVote } = this.props;
    const { isBlankVote, selectedCandidates } = this.state;

    onSubmitVote({
      voteType: 'prefElecVote',
      isBlankVote,
      rankedCandidateIds: isBlankVote
        ? []
        : selectedCandidates.map((c) => c.id),
    });
  };

  public render() {
    const {
      election,
      isSubmittingVote,
      onGoBackToBallot,
      onGoBackToSelectVoterGroup,
    } = this.props;
    const { candidateArray, isBlankVote, selectedCandidates } = this.state;

    const unselectedCandidates = candidateArray.filter(
      (c) => selectedCandidates.indexOf(c) === -1
    );

    const { ballotStep } = this.props;
    const isCandidateSelected = selectedCandidates.length > 0;

    return (
      <>
        {ballotStep === BallotStep.FillOutBallot && (
          <PrefElecBallot
            selectedCandidates={selectedCandidates}
            unselectedCandidates={unselectedCandidates}
            election={election}
            onAddCandidate={this.handleAddCandidate}
            onRemoveCandidate={this.handleRemoveCandidate}
            onMoveCandidate={this.handleMoveCandidate}
            onResetBallot={this.handleResetBallot}
            reviewBallotEnabled={isCandidateSelected}
            onGoBackToSelectVoterGroup={onGoBackToSelectVoterGroup}
            onBlankVote={this.handleBlankVoteAndProceedToReview}
            onReviewBallot={this.handleProceedToReview}
          />
        )}
        {ballotStep === BallotStep.ReviewBallot && (
          <PrefElecReview
            selectedCandidates={selectedCandidates}
            isBlankVote={isBlankVote}
            onGoBackToBallot={onGoBackToBallot}
            onSubmitVote={this.handleSubmitVote}
            isSubmittingVote={isSubmittingVote}
          />
        )}
      </>
    );
  }
}

export default PrefElecVote;
