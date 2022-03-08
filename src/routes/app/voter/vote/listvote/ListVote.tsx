import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Candidate, Election, ElectionList } from 'interfaces';

import { BallotStep } from '../utils';
import ListVoteReview from './ListVoteReview';
import ListVoteBallot from './ListVoteBallot';

// Move to interfaces?
export type PersonalVoteSameParty = {
  candidate: Candidate;
  cumulated: boolean;
  preCumulated: boolean;
};

export type PersonalVoteOtherParty = {
  candidate: Candidate;
  list: ElectionList;
};

export type ListBallot = {
  chosenList: ElectionList;
  personalVotesSameParty: PersonalVoteSameParty[];
  personalVotesOtherParty: PersonalVoteOtherParty[];
};

interface ListVoteProps {
  election: Election;
  ballotStep: BallotStep;
  onProceedToReview: () => void;
  onGoBackToSelectVoterGroup: () => void;
  onGoBackToBallot: () => void;
  onSubmitVote: (ballotData: object) => void;
  isSubmittingVote: boolean;
}

export default function ListVote(props: ListVoteProps) {
  const [ballot, setBallot] = useState<ListBallot | undefined>(undefined);

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

  const electionLists = election.lists;

  // const candidatesRef = useRef(getCandidateArray(election.lists[0].candidates));

  /**
   * We need to wait for the state change before proceeding to review.
   */
  useEffect(() => {
    if (didMountRef.current) {
      onProceedToReview();
    } else {
      didMountRef.current = true;
    }
  }, [isBlankVote, onProceedToReview, ballot]);

  /**
   * Handle voting with no edits.
   */
  const handleCleanVote = (list: ElectionList) => {
    const cleanBallot: ListBallot = {
      chosenList: list,
      personalVotesOtherParty: [],
      personalVotesSameParty: list.candidates.map((candidate) => ({
        candidate: candidate,
        cumulated: false,
        preCumulated: candidate.preCumulated,
      })),
    };
    setBallot(cleanBallot);
  };

  const handleBlankVote = () => {
    setIsBlankVote(true);
  };

  const handleEditVote = (list: ElectionList) => {
    console.info('Not implemented!');
  };

  // TODO Cleanup on return to step 2..
  const handleProceedToReview = () => {
    if (isBlankVote) {
      setIsBlankVote(false);
    } else {
      onProceedToReview();
    }
  };

  const handleSubmitVote = () => {
    // TODO fix

    if (ballot) {
      onSubmitVote({
        voteType: 'SPListElecVote',
        chosenListId: ballot.chosenList.id,
        isBlankVote: isBlankVote,
        personalVotesOtherParty: isBlankVote ? [] : [], // TODO fix when adding vote edit
        personalVotesSameParty: isBlankVote
          ? []
          : ballot.personalVotesSameParty.map((vote) => ({
              candidate: vote.candidate.id,
              cumulated: false,
              precumulated: vote.candidate.preCumulated,
            })),
      });
    }
  };

  return (
    <>
      {ballotStep === BallotStep.FillOutBallot && (
        <ListVoteBallot
          lists={electionLists}
          election={election}
          onGoBackToSelectVoterGroup={onGoBackToSelectVoterGroup}
          onBlankVote={handleBlankVote}
          onCleanVote={handleCleanVote}
          onEditVote={handleEditVote}
        />
      )}
      {ballotStep === BallotStep.ReviewBallot && (
        <ListVoteReview
          ballot={ballot}
          isBlankVote={isBlankVote}
          onGoBackToBallot={onGoBackToBallot}
          onSubmitVote={handleSubmitVote}
          isSubmittingVote={isSubmittingVote}
        />
      )}
    </>
  );
}
