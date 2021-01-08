import React, { useEffect, useRef, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withRouter, RouteComponentProps } from 'react-router';

import { Election } from 'interfaces';
import { shuffleArray } from 'utils/helpers';

import { BallotStep } from './utils';
import MajorityVoteReview from './components/MajorityVoteReview';
import MajorityVoteBallot from './components/MajorityVoteBallot';

interface IProps extends WithTranslation {
  election: Election;
  ballotStep: BallotStep;
  onProceedToReview: () => void;
  onGoBackToSelectVoterGroup: () => void;
  onGoBackToBallot: () => void;
  onSubmitVote: (ballotData: object) => void;
  isSubmittingVote: boolean;
}

const MajorityVote: React.FunctionComponent<IProps &
  RouteComponentProps> = props => {
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState<number>(
    -1
  );
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

  const handleSelectCandidate = (candidateIndex: number) => {
    setSelectedCandidateIndex(candidateIndex);
  };

  const handleDeselectCandidate = () => {
    setSelectedCandidateIndex(-1);
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
    const selectedCandidate =
      shuffledCandidatesRef.current[selectedCandidateIndex];
    onSubmitVote({
      voteType: 'majorityVote',
      isBlankVote,
      rankedCandidateIds:
        selectedCandidate && !isBlankVote ? [selectedCandidate.id] : [],
    });
  };

  return (
    <>
      {ballotStep === BallotStep.FillOutBallot && (
        <MajorityVoteBallot
          candidates={shuffledCandidatesRef.current}
          selectedCandidateIndex={selectedCandidateIndex}
          election={election}
          onSelectCandidate={handleSelectCandidate}
          onDeselectCandidate={handleDeselectCandidate}
          reviewBallotEnabled={selectedCandidateIndex !== -1}
          onGoBackToSelectVoterGroup={onGoBackToSelectVoterGroup}
          onBlankVote={handleBlankVoteAndProceedToReview}
          onReviewBallot={handleProceedToReview}
        />
      )}
      {ballotStep === BallotStep.ReviewBallot && (
        <MajorityVoteReview
          selectedCandidate={
            shuffledCandidatesRef.current[selectedCandidateIndex]
          }
          isBlankVote={isBlankVote}
          onGoBackToBallot={onGoBackToBallot}
          onSubmitVote={handleSubmitVote}
          isSubmittingVote={isSubmittingVote}
        />
      )}
    </>
  );
};

export default withTranslation()(withRouter(MajorityVote));
