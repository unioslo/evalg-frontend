import * as React from 'react';
import { translate } from 'react-i18next';
import { TranslateHocProps } from 'react-i18next/src/translate';

import { shuffleArray } from '../../../../utils/helpers';
import MajorityVoteReview from './components/MajorityVoteReview';
import MajorityVoteBallot from './components/MajorityVoteBallot';
import { Candidate, Election } from '../../../../interfaces';
import { withRouter, RouteComponentProps } from 'react-router';
import { BallotStep } from '.';

interface IProps extends TranslateHocProps {
  election: Election;
  ballotStep: BallotStep;
  onProceedToReview: () => void;
  onGoBackToSelectVoterGroup: () => void;
  onGoBackToBallot: () => void;
  onSubmitVote: (ballotData: object) => void;
}

interface IState {
  selectedCandidateIndex: number;
  selectedCandidate: Candidate | null;
  isBlankVote: boolean;
}

class MajorityVote extends React.Component<
  IProps & RouteComponentProps,
  IState
> {
  readonly state: IState = {
    selectedCandidateIndex: -1,
    selectedCandidate: null,
    isBlankVote: false,
  };

  readonly shuffledCandidates = shuffleArray(
    this.props.election.lists[0].candidates
  );

  public render() {
    const { ballotStep } = this.props;
    const isCandidateSelected = this.state.selectedCandidateIndex !== -1;

    return (
      <>
        {ballotStep === BallotStep.FillOutBallot && (
          <MajorityVoteBallot
            candidates={this.shuffledCandidates}
            selectedCandidateIndex={this.state.selectedCandidateIndex}
            election={this.props.election}
            onSelectCandidate={this.handleSelectCandidate}
            onDeselectCandidate={this.handleDeselectCandidate}
            reviewBallotEnabled={isCandidateSelected}
            onGoBackToSelectVoterGroup={this.props.onGoBackToSelectVoterGroup}
            onBlankVote={this.handleBlankVoteAndProceedToReview}
            onReviewBallot={this.handleProceedToReview}
          />
        )}
        {ballotStep === BallotStep.ReviewBallot && (
          <MajorityVoteReview
            selectedCandidate={this.state.selectedCandidate}
            isBlankVote={this.state.isBlankVote}
            onGoBackToBallot={this.props.onGoBackToBallot}
            onSubmitVote={this.handleSubmitVote}
          />
        )}
      </>
    );
  }

  handleSelectCandidate = (selectedCandidateIndex: number) => {
    this.setState({
      selectedCandidateIndex,
      selectedCandidate: this.shuffledCandidates[selectedCandidateIndex],
    });
  };

  handleDeselectCandidate = () => {
    this.setState({ selectedCandidateIndex: -1 });
  };

  handleBlankVoteAndProceedToReview = () => {
    this.setState(
      {
        isBlankVote: true,
        selectedCandidateIndex: -1,
        selectedCandidate: null,
      },
      this.props.onProceedToReview
    );
  };

  handleProceedToReview = () => {
    this.setState({ isBlankVote: false }, this.props.onProceedToReview);
  };

  handleSubmitVote = () => {
    this.props.onSubmitVote({
      voteType: 'majorityVote',
      isBlankVote: this.state.isBlankVote,
      candidateId:
        this.state.selectedCandidate && this.state.selectedCandidate.id,
    });
  };
}

export default translate()(withRouter(MajorityVote));
