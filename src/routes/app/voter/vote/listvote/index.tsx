import { useEffect, useRef, useState } from 'react';

import { Election, EditListCandidate, ElectionList } from 'interfaces';
import { shuffleArray } from 'utils/helpers';

import EditVote from './edit';
import ListVoteReview from './review';
import SelectElectionList from './select';
import {
  createBlankListBallot,
  createCleanListBallot,
  createEditListBallot,
} from './utils';
import { BallotStep } from '../utils';

interface ListVoteProps {
  ballotStep: BallotStep;
  election: Election;
  isSubmittingVote: boolean;
  onGoBackToBallot: () => void;
  onGoBackToSelectVoterGroup: () => void;
  onProceedToReview: () => void;
  onSubmitVote: (ballotData: object) => void;
}

/**
 *
 */
export default function ListVote(props: ListVoteProps) {
  const {
    ballotStep,
    election,
    isSubmittingVote,
    onGoBackToBallot,
    onGoBackToSelectVoterGroup,
    onProceedToReview,
    onSubmitVote,
  } = props;

  /**
   * Display the lists in random order.
   */
  const shuffledListsRef = useRef(shuffleArray(election.lists));

  /**
   * State for the current selected list.
   */
  const [expandedList, setExpandedList] = useState<string>('');

  /**
   * State and ref needed for a blank vote.
   *
   * We need to wait for the state change before proceeding to review.
   */
  const [isBlankVote, setIsBlankVote] = useState<boolean>(false);
  const didMountBlankVoteRef = useRef(false);
  useEffect(() => {
    if (didMountBlankVoteRef.current) {
      if (isBlankVote) {
        onProceedToReview();
      }
    } else {
      didMountBlankVoteRef.current = true;
    }
  }, [isBlankVote, onProceedToReview]);

  /**
   * State and ref needed for a clean list vote.
   *
   * We need to wait for the state change before proceeding to review.
   */
  const [cleanVoteList, setCleanVoteList] = useState<ElectionList | undefined>(
    undefined
  );
  const didMountCleanVoteRef = useRef(false);
  useEffect(() => {
    if (didMountCleanVoteRef.current) {
      if (cleanVoteList) {
        onProceedToReview();
      }
    } else {
      didMountCleanVoteRef.current = true;
    }
  }, [cleanVoteList, onProceedToReview]);

  /**
   * States needed for a edited list vote.
   *
   * - The selected list to edit
   * - The current state of the candidates in the list
   * - A list of candidates from other lists
   */
  const [selectedEditList, setSelectedEditList] = useState<
    ElectionList | undefined
  >(undefined);
  const [editedCandidates, setEditedCandidates] = useState<EditListCandidate[]>(
    []
  );
  const [otherListCandidates, setOtherListCandidates] = useState<
    EditListCandidate[]
  >([]);

  /**
   * Initiate the data we need when starting to edit a list.
   */
  const handleEditVote = (list: ElectionList) => {
    // No changes to list. Sort the lists candidates by priority
    setSelectedEditList(list);
    const listCandidatesSorted = [...list.candidates].sort(
      (a, b) => a.priority - b.priority
    );
    setEditedCandidates(
      listCandidatesSorted.map((candidate) => ({
        sourceList: list,
        candidate: candidate,
        userCumulated: false,
        userDeleted: false,
      }))
    );
  };

  /**
   * Cleanup the vote changes etc when returning
   * to the main "select list" page.
   */
  const handleGoBackToBallot = () => {
    if (isBlankVote) {
      setIsBlankVote(false);
    }
    if (cleanVoteList) {
      setCleanVoteList(undefined);
    }
    if (selectedEditList) {
      setSelectedEditList(undefined);
    }
    if (editedCandidates.length > 0) {
      setEditedCandidates([]);
    }
    if (otherListCandidates.length > 0) {
      setOtherListCandidates([]);
    }
    onGoBackToBallot();
  };

  /**
   * Handle the different types of votes.
   */
  const submitCleanVote = () => {
    if (cleanVoteList) {
      onSubmitVote(createCleanListBallot(cleanVoteList));
    }
  };
  const submitBlankVote = () => {
    onSubmitVote(createBlankListBallot());
  };
  const submitEditVote = () => {
    if (selectedEditList) {
      onSubmitVote(
        createEditListBallot(
          selectedEditList,
          editedCandidates,
          otherListCandidates
        )
      );
    }
  };

  if (ballotStep === BallotStep.ReviewBallot) {
    if (cleanVoteList) {
      return (
        <ListVoteReview
          editedCandidates={undefined}
          isSubmittingVote={isSubmittingVote}
          onGoBackToBallot={handleGoBackToBallot}
          onSubmitVote={submitCleanVote}
          selectedList={cleanVoteList}
          voteType="clean"
        />
      );
    } else if (selectedEditList) {
      return (
        <ListVoteReview
          editedCandidates={editedCandidates}
          isSubmittingVote={isSubmittingVote}
          onGoBackToBallot={onGoBackToBallot}
          onSubmitVote={submitEditVote}
          otherListCandidates={otherListCandidates}
          selectedList={selectedEditList}
          voteType="edited"
        />
      );
    } else if (isBlankVote) {
      return (
        <ListVoteReview
          editedCandidates={editedCandidates}
          isSubmittingVote={isSubmittingVote}
          onGoBackToBallot={handleGoBackToBallot}
          onSubmitVote={submitBlankVote}
          selectedList={selectedEditList}
          voteType="blank"
        />
      );
    }
  } else if (ballotStep === BallotStep.FillOutBallot) {
    if (selectedEditList) {
      return (
        <EditVote
          onGoBackToBallot={handleGoBackToBallot}
          editedCandidates={editedCandidates}
          election={election}
          onReviewBallot={onProceedToReview}
          otherListCandidates={otherListCandidates}
          selectedList={selectedEditList}
          setEditedCandidates={setEditedCandidates}
          setOtherListCandidates={setOtherListCandidates}
        />
      );
    }
    return (
      <>
        <SelectElectionList
          lists={shuffledListsRef.current}
          election={election}
          expandedList={expandedList}
          onGoBackToSelectVoterGroup={onGoBackToSelectVoterGroup}
          onBlankVote={() => setIsBlankVote(true)}
          onCleanVote={(list: ElectionList) => setCleanVoteList(list)}
          onEditVote={handleEditVote}
          setExpandedList={setExpandedList}
        />
      </>
    );
  }

  // TODO Show error message here.
  return null;
}
