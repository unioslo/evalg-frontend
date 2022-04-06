export const electionListA = {
  id: '1d51ad81-3a28-4a72-afcd-4da0716b9370',
  name: {
    nb: 'Ventelista',
    nn: 'Ventelista',
    en: 'Ventelista',
  },
  description: {
    nb: 'Listen for oss som venter',
    nn: 'Listen for oss som venter',
    en: 'Listen for oss som venter',
  },
  informationUrl: 'https://uio.no',
  candidates: [
    {
      id: '65b50bfb-18f6-4d66-be8a-8e31da2f8ea2',
      name: 'Heldig Gravemaskin',
      meta: {
        fieldOfStudy: 'Informatikk',
      },
      informationUrl: '',
      priority: 3,
      preCumulated: true,
    },
    {
      id: '7a41d115-c8de-41e7-a009-d7f1058660c4',
      name: 'Robust Mandagsbil',
      meta: {
        fieldOfStudy: '',
      },
      informationUrl: '',
      priority: 2,
      preCumulated: true,
    },
    {
      id: '1eeb371c-ec02-4303-828d-85f5f90a8475',
      name: 'Uforgjengelig Vane',
      meta: {
        fieldOfStudy: '',
      },
      informationUrl: '',
      priority: 1,
      preCumulated: true,
    },
    {
      id: 'e48acf3f-1285-4743-99cd-3558ad6e9393',
      name: 'Unormal Kveldsmat',
      meta: {
        fieldOfStudy: '',
      },
      informationUrl: '',
      priority: 5,
      preCumulated: true,
    },
    {
      id: '7b9bc8d0-3a5f-4de6-851b-86abb8da99cb',
      name: 'Solid Fallskjermhopper',
      meta: {
        fieldOfStudy: '',
      },
      informationUrl: '',
      priority: 4,
      preCumulated: false,
    },
  ],
};

export const electionListB = {
  id: '1d51ad82-3a28-4a72-afcd-4da0716b9372',
  name: {
    nb: 'b',
    nn: 'b',
    en: 'b',
  },
  description: {
    nb: 'b',
    nn: 'b',
    en: 'b',
  },
  informationUrl: 'https://uio.no',
  candidates: [
    {
      id: '65b50bfb-18f6-4d66-be8a-8e31da2f8ea4',
      name: 'Heldig Gravemaskin',
      meta: {
        fieldOfStudy: 'Informatikk',
      },
      informationUrl: '',
      priority: 3,
      preCumulated: true,
    },
    {
      id: '7a41d115-c8de-41e7-a009-d7f1058660c5',
      name: 'Robust Mandagsbil',
      meta: {
        fieldOfStudy: '',
      },
      informationUrl: '',
      priority: 2,
      preCumulated: true,
    },
    {
      id: '1eeb371c-ec02-4303-828d-85f5f90a8476',
      name: 'Uforgjengelig Vane',
      meta: {
        fieldOfStudy: '',
      },
      informationUrl: '',
      priority: 1,
      preCumulated: true,
    },
    {
      id: 'e48acf3f-1285-4743-99cd-3558ad6e9394',
      name: 'Unormal Kveldsmat',
      meta: {
        fieldOfStudy: '',
      },
      informationUrl: '',
      priority: 5,
      preCumulated: true,
    },
    {
      id: '7b9bc8d0-3a5f-4de6-851b-86abb8da99c4',
      name: 'Solid Fallskjermhopper',
      meta: {
        fieldOfStudy: '',
      },
      informationUrl: '',
      priority: 4,
      preCumulated: false,
    },
  ],
};

export const mockListElection = {
  id: '9454b310-c589-408c-8978-a441e5e5e7e3',
  name: {
    nb: 'Studentparlament ved UiO',
    nn: 'Studentparlament ved uio',
    en: 'Student parliament at uio',
  },
  meta: {
    candidateType: 'party_list',
    candidateRules: {
      seats: 30,
      substitutes: 30,
      candidateGender: false,
    },
    ballotRules: {
      deleteCandidate: true,
      cumulate: true,
      alterPriority: true,
      otherListCandidateVotes: true,
      votes: 'all',
      voting: 'list',
    },
    countingRules: {
      method: 'sainte_lague',
      firstDivisor: 1,
      precumulate: 1,
      listVotes: 'seats',
      otherListCandidateVotes: true,
    },
  },
  active: true,
  status: 'ongoing',
  start: '2022-03-29 07:00:00+00:00',
  end: '2022-04-05 11:00:00+00:00',
  mandatePeriodStart: '2022-07-01',
  mandatePeriodEnd: '2023-07-01',
  informationUrl: '',
  isLocked: true,
  pollbooks: [],
  lists: [electionListA, electionListB],
};
