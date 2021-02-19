import React, { useEffect, useRef, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { Candidate, Election } from 'interfaces';
import { shuffleArray } from 'utils/helpers';

import { BallotStep } from './utils';
import PollVoteReview from './components/PollVoteReview';
import PollVoteBallot from './components/PollVoteBallot';

interface IProps {
  election: Election;
  ballotStep: BallotStep;
  onProceedToReview: () => void;
  onGoBackToSelectVoterGroup: () => void;
  onGoBackToBallot: () => void;
  onSubmitVote: (ballotData: object) => void;
  isSubmittingVote: boolean;
}

const PollVote: React.FunctionComponent<IProps &
  RouteComponentProps> = props => {
  const [
    selectedAlternative,
    setSelectedAlternative,
  ] = useState<Candidate | null>(null);
  const [isBlankVote, setIsBlankVote] = useState<boolean>(false);

  const didMountRef = useRef(false);
  const {
    ballotStep,
    election,
    isSubmittingVote,
    onGoBackToBallot,
    onGoBackToSelectVoterGroup,
    onProceedToReview,
    onSubmitVote,
  } = props;

  const shuffledCandidatesRef = useRef(
    shuffleArray(election.lists[0].candidates)
  );

  useEffect(() => {
    if (didMountRef.current) {
      onProceedToReview();
    } else {
      didMountRef.current = true;
    }
  }, [isBlankVote, onProceedToReview]);

  const handleSelectAlternative = (alternative: Candidate) => {
    setSelectedAlternative(alternative);
  };

  const handleDeselectAlternative = () => {
    setSelectedAlternative(null);
  };

  const handleBlankVoteAndProceedToReview = () => {
    setIsBlankVote(true);
  };

  const handleProceedToReview = () => {
    if (isBlankVote) {
      setIsBlankVote(false);
    } else {
      onProceedToReview();
    }
  };

  const handleSubmitVote = () => {
    onSubmitVote({
      voteType: 'pollVote',
      isBlankVote,
      selectedAlternativeId: isBlankVote ? null : selectedAlternative?.id,
    });
  };

  const isReviewButtonEnabled = () => {
    if (selectedAlternative) {
      return true;
    }
    return false;
  };

  return (
    <>
      {ballotStep === BallotStep.FillOutBallot && (
        <PollVoteBallot
          alternatives={shuffledCandidatesRef.current}
          selectedAlternative={selectedAlternative}
          election={election}
          onSelectAlternative={handleSelectAlternative}
          onDeselectAlternative={handleDeselectAlternative}
          reviewBallotEnabled={isReviewButtonEnabled()}
          onGoBackToSelectVoterGroup={onGoBackToSelectVoterGroup}
          onBlankVote={handleBlankVoteAndProceedToReview}
          onReviewBallot={handleProceedToReview}
        />
      )}
      {ballotStep === BallotStep.ReviewBallot && (
        <PollVoteReview
          selectedAlternative={selectedAlternative}
          isBlankVote={isBlankVote}
          onGoBackToBallot={onGoBackToBallot}
          onSubmitVote={handleSubmitVote}
          isSubmittingVote={isSubmittingVote}
        />
      )}
    </>
  );
};

export default withRouter(PollVote);
