import { EditListCandidate, ElectionList } from 'interfaces';

/**
 * Create the ballot data for a list votes with edits.
 *
 * @param selectedList The list voted for.
 * @param editedCandidates The new updated candidate order and cumulate status for the list.
 * @param otherListCandidates Any personal votes for candidates in other lists.
 * @returns
 */
export function createEditListBallot(
  selectedList: ElectionList,
  editedCandidates: EditListCandidate[],
  otherListCandidates: EditListCandidate[]
) {
  return {
    voteType: 'SPListElecVote',
    chosenListId: selectedList.id,
    isBlankVote: false,
    personalVotesOtherParty: otherListCandidates.map((candidate) => ({
      candidate: candidate.candidate.id,
      list: candidate.sourceList.id,
    })),
    personalVotesSameParty: editedCandidates
      .filter((candidate) => !candidate.userDeleted)
      .map((candidate) => ({
        candidate: candidate.candidate.id,
        cumulated: candidate.userCumulated,
      })),
  };
}

/**
 * Create the ballot data for a blank list vote.
 *
 * @returns Blank vote ballot data
 */
export function createBlankListBallot() {
  return {
    voteType: 'SPListElecVote',
    chosenListId: '',
    isBlankVote: true,
    personalVotesOtherParty: [],
    personalVotesSameParty: [],
  };
}

/**
 * Creates ballot data for a list vote with no changes
 *
 * @param electionList Election list we want to vote for
 * @returns Ballot data for a election vote with no changes.
 */
export function createCleanListBallot(electionList: ElectionList) {
  const candidatesAfterPriority = [...electionList.candidates].sort(
    (a, b) => a.priority - b.priority
  );
  return {
    voteType: 'SPListElecVote',
    chosenListId: electionList.id,
    isBlankVote: false,
    personalVotesOtherParty: [],
    personalVotesSameParty: candidatesAfterPriority.map((candidate) => ({
      candidate: candidate.id,
      cumulated: false,
    })),
  };
}
