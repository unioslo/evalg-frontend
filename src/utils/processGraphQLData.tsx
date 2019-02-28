import { Election, ElectionGroup } from '../interfaces';


const multipleElectionsSortingOrder = [
  'Academic staff',
  'Temporary academic staff',
  'Technical and administrative staff',
  'Students',
];

/**
 * Order elections of an election group in a set order, so they can be listed in
 * the same order consistently even though their ordering changes between
 * queries. Meant to be used with the elections array of an election group with
 * type=multiple_elections.
 * @param elections Array of elections from an election group to order
 */
export const orderMultipleElections = (elections: Election[]): Election[] => {
  if (elections.length === 1) {
    return elections;
  }

  const orderedElections: Election[] = [];
  const processedIndexes: number[] = [];

  for (const orderedElectionName of multipleElectionsSortingOrder) {
    for (let i = 0; i < elections.length; i++) {
      if (elections[i].name.en === orderedElectionName) {
        orderedElections.push(elections[i]);
        processedIndexes.push(i);
      }
    }
  }

  for (let i = 0; i < elections.length; i++) {
    if (processedIndexes.indexOf(i) === -1) {
      orderedElections.push(elections[i]);
    }
  }

  return orderedElections;
};

export const electionGroupWithOrderedElections = (
  electionGroup: ElectionGroup,
  options?: { onlyActiveElections: boolean }
): ElectionGroup => {
  if (electionGroup.type !== 'multiple_elections') {
    return electionGroup;
  }

  const processedElections = orderMultipleElections(
    options && options.onlyActiveElections
      ? electionGroup.elections.filter(e => e.active)
      : electionGroup.elections
  );

  const electionGroupWithProcessedElections = {
    ...electionGroup,
    elections: processedElections,
  };
  return electionGroupWithProcessedElections;
};
