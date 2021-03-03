import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter, RouteComponentProps } from 'react-router';

import { Candidate, Election } from 'interfaces';
import { getCandidateArray } from 'utils/helpers';

import { BallotStep } from './utils';
import MajorityVoteReview from './components/MajorityVoteReview';
import MajorityVoteBallot from './components/MajorityVoteBallot';

interface IProps {
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
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [isBlankVote, setIsBlankVote] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
  const { t } = useTranslation();

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
  const candidatesRef = useRef(
    getCandidateArray(election.lists[0].candidates)
  );

  useEffect(() => {
    if (didMountRef.current) {
      onProceedToReview();
    } else {
      didMountRef.current = true;
    }
  }, [isBlankVote, onProceedToReview]);

  useEffect(() => {
    if (
      typeof election.meta.ballotRules.votes === 'number' &&
      selectedCandidates.length > election.meta.ballotRules.votes
    ) {
      setErrorMsg(
        t('voter.majorityVoteToManyVotesError', {
          nrValid: election.meta.ballotRules.votes,
          nrSelected: selectedCandidates.length,
        })
      );
    } else {
      setErrorMsg(undefined);
    }
  }, [selectedCandidates, election, t]);

  const handleSelectCandidate = (candidate: Candidate) => {
    if (
      election.meta.ballotRules.votes === 'all' ||
      election.meta.ballotRules.votes === 1
    ) {
      // We can only vote for 1 candidate. Flip the selection.
      setSelectedCandidates([candidate]);
    } else if (!selectedCandidates.includes(candidate)) {
      setSelectedCandidates(selectedCandidates.concat([candidate]));
    }
  };

  const handleDeselectCandidate = (candidate: Candidate) => {
    setSelectedCandidates(selectedCandidates.filter(c => c !== candidate));
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
      voteType: 'majorityVote',
      isBlankVote,
      rankedCandidateIds: isBlankVote ? [] : selectedCandidates.map(c => c.id),
    });
  };

  const isReviewButtonEnabled = () => {
    if (
      election.meta.ballotRules.votes === 'all' &&
      selectedCandidates.length === 1
    ) {
      // UiO hack..
      return true;
    } else if (
      selectedCandidates.length >= 1 &&
      selectedCandidates.length <= election.meta.ballotRules.votes
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      {ballotStep === BallotStep.FillOutBallot && (
        <MajorityVoteBallot
          candidates={candidatesRef.current}
          selectedCandidates={selectedCandidates}
          election={election}
          errorMsg={errorMsg}
          onSelectCandidate={handleSelectCandidate}
          onDeselectCandidate={handleDeselectCandidate}
          reviewBallotEnabled={isReviewButtonEnabled()}
          onGoBackToSelectVoterGroup={onGoBackToSelectVoterGroup}
          onBlankVote={handleBlankVoteAndProceedToReview}
          onReviewBallot={handleProceedToReview}
        />
      )}
      {ballotStep === BallotStep.ReviewBallot && (
        <MajorityVoteReview
          selectedCandidates={selectedCandidates}
          isBlankVote={isBlankVote}
          onGoBackToBallot={onGoBackToBallot}
          onSubmitVote={handleSubmitVote}
          isSubmittingVote={isSubmittingVote}
        />
      )}
    </>
  );
};

export default withRouter(MajorityVote);
