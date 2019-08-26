import {
  Election,
  ElectionGroup,
  ElectionResult,
  IPerson,
} from '../interfaces';

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
    for (let i = 0; i < elections.length; i += 1) {
      if (elections[i].name.en === orderedElectionName) {
        orderedElections.push(elections[i]);
        processedIndexes.push(i);
      }
    }
  }

  for (let i = 0; i < elections.length; i += 1) {
    if (processedIndexes.indexOf(i) === -1) {
      orderedElections.push(elections[i]);
    }
  }

  return orderedElections;
};

export const orderElectionResults = (
  electionResults: ElectionResult[]
): ElectionResult[] => {
  if (electionResults.length === 1) {
    return electionResults;
  }

  const orderedElectionResults: ElectionResult[] = [];
  const processedIndexes: number[] = [];

  for (const orderedElectionName of multipleElectionsSortingOrder) {
    for (let i = 0; i < electionResults.length; i += 1) {
      if (electionResults[i].election.name.en === orderedElectionName) {
        orderedElectionResults.push(electionResults[i]);
        processedIndexes.push(i);
      }
    }
  }

  for (let i = 0; i < electionResults.length; i += 1) {
    if (processedIndexes.indexOf(i) === -1) {
      orderedElectionResults.push(electionResults[i]);
    }
  }

  return orderedElectionResults;
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

  return {
    ...electionGroup,
    elections: processedElections,
  };
};

export const idValueForPerson = (person: IPerson) => {
  if (!person) return '';

  const { identifiers } = person;

  for (let id of identifiers) {
    if (id.idType === 'feide_id') {
      return id.idValue;
    }
  }
  // Fallback to uid
  for (let id of identifiers) {
    if (id.idType === 'uid') {
      return id.idValue;
    }
  }
  // fallback to person UUID
  return person.id;
};

// From https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
export const b64toBlob = (
  b64Data: string,
  contentType = '',
  sliceSize = 512
) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
