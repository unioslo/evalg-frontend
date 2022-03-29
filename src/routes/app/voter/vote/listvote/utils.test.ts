import { Candidate, EditListCandidate, ElectionList } from 'interfaces';

import { electionListA, electionListB } from 'test-data';
import {
  createBlankListBallot,
  createCleanListBallot,
  createEditListBallot,
} from './utils';

it('creates valid blank ballot', () => {
  const blankBallot = createBlankListBallot();
  expect(blankBallot.isBlankVote).toEqual(true);
  expect(blankBallot.chosenListId).toEqual('');
  expect(blankBallot.personalVotesOtherParty).toEqual([]);
  expect(blankBallot.personalVotesSameParty).toEqual([]);
});

it('creates valid clean ballot', () => {
  const expectedCandidates = electionListA.candidates
    .sort((a, b) => a.priority - b.priority)
    .map((candidate) => ({ candidate: candidate.id, cumulated: false }));

  const cleanBallot = createCleanListBallot(electionListA as ElectionList);
  expect(cleanBallot.isBlankVote).toEqual(false);
  expect(cleanBallot.chosenListId).toEqual(electionListA.id);
  expect(cleanBallot.personalVotesOtherParty).toEqual([]);
  expect(cleanBallot.personalVotesSameParty).toEqual(expectedCandidates);
});

it('creates valid edited ballot', () => {
  const editedCandidateList = electionListA.candidates.map((candidate) => ({
    candidate: candidate,
    sourceList: electionListA,
    userCumulated: false,
    userDeleted: false,
  }));
  editedCandidateList[1].userDeleted = true;
  editedCandidateList[2].userDeleted = true;
  editedCandidateList[3].userCumulated = true;

  const expectedEditedCandidates = editedCandidateList
    .filter((candidate) => !candidate.userDeleted)
    .map((candidate) => ({
      candidate: candidate.candidate.id,
      cumulated: candidate.userCumulated,
    }));

  const otherCandidates: EditListCandidate[] = [
    {
      candidate: electionListB.candidates[1] as Candidate,
      sourceList: electionListB as ElectionList,
      userCumulated: false,
      userDeleted: false,
    },
    {
      candidate: electionListB.candidates[3] as Candidate,
      sourceList: electionListB as ElectionList,
      userCumulated: false,
      userDeleted: false,
    },
  ];

  const expectedOtherCandidates = otherCandidates.map((candidate) => ({
    candidate: candidate.candidate.id,
    list: electionListB.id,
  }));

  const editedBallot = createEditListBallot(
    electionListA as ElectionList,
    editedCandidateList as any,
    otherCandidates
  );
  expect(editedBallot.isBlankVote).toEqual(false);
  expect(editedBallot.chosenListId).toEqual(electionListA.id);
  expect(editedBallot.personalVotesOtherParty).toEqual(expectedOtherCandidates);
  expect(editedBallot.personalVotesSameParty).toEqual(expectedEditedCandidates);
});
