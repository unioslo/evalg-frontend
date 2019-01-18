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
  let unprocessedElections = [...elections];

  for (const electionNameInOrder of electionsOrder) {
    const removeIndexes: number[] = [];
    for (let i = 0; i < unprocessedElections.length; i++) {
      if (unprocessedElections[i].name.en === electionNameInOrder) {
        orderedElections.push(unprocessedElections[i]);
        removeIndexes.push(i);
      }
    }
    const newUnprocessedElections: Election[] = [];
    for (let i = 0; i < unprocessedElections.length; i++) {
      if (removeIndexes.indexOf(i) === -1) {
        newUnprocessedElections.push(unprocessedElections[i]);
      }
    }
    unprocessedElections = newUnprocessedElections;
  }

  for (const unprocessedElection of unprocessedElections) {
    orderedElections.push(unprocessedElection);
  }

  return orderedElections;
};
