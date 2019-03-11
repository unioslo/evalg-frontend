import * as React from 'react';

import { shuffleArray } from '../../../../utils/helpers';
import PrefElecBallot from './components/PrefElecBallot';
import PrefElecReview from './components/PrefElecReview';
import { Election, Candidate } from '../../../../interfaces';
import { RouteComponentProps } from 'react-router';
import { BallotStep } from '.';

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

interface IProps {
  election: Election;
  ballotStep: BallotStep;
  onProceedToReview: () => void;
  onGoBackToSelectVoterGroup: () => void;
  onGoBackToBallot: () => void;
  onSubmitVote: (ballotData: object) => void;
}

interface IState {
  selectedCandidates: Candidate[];
  shuffledCandidates: Candidate[];
  isBlankVote: boolean;
}

class PrefElecVote extends React.Component<
  IProps & RouteComponentProps,
  IState
> {
  constructor(props: IProps & RouteComponentProps) {
    super(props);
    this.state = {
      shuffledCandidates: shuffleArray(props.election.lists[0].candidates),
      selectedCandidates: [],
      isBlankVote: false,
    };
  }

  public render() {
    const unselectedCandidates = this.state.shuffledCandidates.filter(
      c => this.state.selectedCandidates.indexOf(c) === -1
    );

    const { ballotStep } = this.props;
    const isCandidateSelected = this.state.selectedCandidates.length > 0;

    return (
      <>
        {ballotStep === BallotStep.FillOutBallot && (
          <PrefElecBallot
            selectedCandidates={this.state.selectedCandidates}
            unselectedCandidates={unselectedCandidates}
            election={this.props.election}
            onAddCandidate={this.handleAddCandidate}
            onRemoveCandidate={this.handleRemoveCandidate}
            onMoveCandidate={this.handleMoveCandidate}
            onResetBallot={this.handleResetBallot}
            reviewBallotEnabled={isCandidateSelected}
            onGoBackToSelectVoterGroup={this.props.onGoBackToSelectVoterGroup}
            onBlankVote={this.handleBlankVoteAndProceedToReview}
            onReviewBallot={this.handleProceedToReview}
          />
        )}
        {ballotStep === BallotStep.ReviewBallot && (
          <PrefElecReview
            selectedCandidates={this.state.selectedCandidates}
            isBlankVote={this.state.isBlankVote}
            onGoBackToBallot={this.props.onGoBackToBallot}
            onSubmitVote={this.handleSubmitVote}
          />
        )}
      </>
    );
  }

  handleAddCandidate = (candidate: Candidate) => {
    this.setState(currState => ({
      selectedCandidates: currState.selectedCandidates.concat([candidate]),
    }));
  };

  handleRemoveCandidate = (candidate: Candidate) => {
    const selectedCandidates = this.state.selectedCandidates.filter(
      c => c !== candidate
    );
    this.setState({ selectedCandidates });
  };

  handleMoveCandidate = (oldIndex: number, newIndex: number) => {
    const emptyArray: Candidate[] = [];
    const arrayCopy: Candidate[] = emptyArray.concat(
      this.state.selectedCandidates
    );
    moveArrayItem(arrayCopy, oldIndex, newIndex);
    this.setState({ selectedCandidates: arrayCopy });
  };

  handleResetBallot = () => {
    this.setState({ selectedCandidates: [] });
  };

  handleBlankVoteAndProceedToReview = () => {
    this.setState(
      { isBlankVote: true, selectedCandidates: [] },
      this.props.onProceedToReview
    );
  };

  handleProceedToReview = () => {
    this.setState({ isBlankVote: false }, this.props.onProceedToReview);
  };

  handleSubmitVote = () => {
    this.props.onSubmitVote({
      voteType: 'prefElecVote',
      isBlankVote: this.state.isBlankVote,
      rankedCandidateIds: this.state.selectedCandidates.map(c => c.id),
    });
  };
}

export default PrefElecVote;
