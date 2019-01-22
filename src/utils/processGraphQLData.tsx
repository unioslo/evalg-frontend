/**
 * Order elections of an election group in a set order, so they can be listed in
 * the same order consistently even though their ordering changes between
 * queries. Meant to be used with the elections array of an election group with
 * type=multiple_elections. 
 * @param elections Array of elections from an election group to order
 */

export const orderMultipleElections = (elections: Election[]): Election[] => {
  const electionsOrder = [
    'Academic staff',
    'Temporary academic staff',
    'Technical and administrative staff',
    'Students',
  ];

  if (elections.length === 1) {
    return elections;
  }

  const orderedElections: Election[] = [];
  const processedIndexes: number[] = [];

  for (const electionNameInOrder of electionsOrder) {
    for (let i = 0; i < elections.length; i++) {
      if (elections[i].name.en === electionNameInOrder) {
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
