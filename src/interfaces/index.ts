export interface EvalgClientState {
  voter: {
    selectedPollBookID: string;
    notInPollBookJustification: string;
  };
  signedInPerson: SignedInPerson;
  admin: { isCreatingNewElection: boolean };
}

export interface SignedInPerson {
  __typename: 'signedInPerson';
  displayName?: string;
  personId: string;
}

export interface Viewer {
  person: IPerson;
}

export interface VotersForPerson {
  id: string;
  tag: string;
  idType: string;
  idValue: string;
  manual: boolean;
  verified: boolean;
  pollbookID: string;
  pollbook: IPollBook;
}

export interface IMutationResponse {
  success: boolean;
  code: string | null;
  message: string | null;
}

export interface NameFields {
  [key: string]: string;
  nb: string;
  nn: string;
  en: string;
}

export interface DropDownOption {
  name: string;
  value: any;
}

export type ElectionStatusType =
  | 'closed'
  | 'published'
  | 'draft'
  | 'announced'
  | 'ongoing'
  | 'cancelled'
  | 'multipleStatuses';

export interface IPerson {
  id: string;
  displayName: string;
  nin: string;
}

export interface IVoter {
  id: string;
  person: IPerson;
  pollbookId: string;
}

export interface IPollBook {
  id: string;
  name: NameFields;
  weight: number;
  priority: number;
  voters: IVoter[];
  election: Election;
}

export interface Candidate {
  id: string;
  name: string;
  listId: string;
  list: ElectionList;
  informationUrl: string;
  priority: number;
  preCumulated: boolean;
  meta: {
    coCandidates?: coCandidate[];
  };
}

export interface coCandidate {
  name: string;
}

export interface ElectionList {
  id: string;
  name: NameFields;
  description: NameFields;
  informationUrl: string;
  candidates: Candidate[];
}

export interface Election {
  id: string;
  name: NameFields;
  start: string;
  end: string;
  votesOutsideCensus: number;
  totalVotes: number;
  status: ElectionStatusType;
  pollbooks: IPollBook[];
  meta: ElectionMetaData;
  electionGroup: ElectionGroup;
  active: boolean;
  mandatePeriodStart: string;
  mandatePeriodEnd: string;
  contact: string;
  informationUrl: string;
  tz: string;
  lists: ElectionList[];
}

export interface ElectionGroup {
  id: string;
  type: 'single_election' | 'multiple_elections'; // TODO: Are there more possibilities?
  name: NameFields;
  start: string | null;
  end: string | null;
  mandatePeriodStart: string;
  mandatePeriodEnd: string;
  meta: ElectionMetaData;
  hasMultipleMandateTimes: boolean;
  hasMultipleVotingTimes: boolean;
  hasMultipleElections: boolean;
  canModifyElections: boolean;
  elections: Election[];
  status: ElectionStatusType;
  hasGenderQuota: boolean;
  hasMultipleContactInfo: boolean;
  hasMultipleInfoUrls: boolean;
  hasMultipleCandidateLists: boolean;
  contact: string;
  informationUrl: string;
  tz: string;
  roles: Array<any>;
  publicKey: string;
  announced: boolean;
  published: boolean;
  announcementBlockers: Array<string>;
  publicationBlockers: Array<string>;
}

// TODO: Make sure underneath meta structure and rest of type definitions here is correct to some specification.
export type ElectionMetaData = {
  ballotRules: {
    votes: BallotRulesVotes;
    voting: BallotRulesVoting;
  };
  candidateRules: {
    candidateGender: boolean;
    seats: number;
    substitutes: number;
  };
  candidateType: CandidateType;
  countingRules: {
    affirmativeAction: CountingRulesAffirmationAction;
    method: CountingRulesMethod;
  };
};

// TODO: Specify all possible options and delete string from union types.
export type BallotRulesVotes = 'all' | string;
export type BallotRulesVoting = 'rank_candidates' | string;
export type CandidateType = 'single' | string;
export type CountingRulesAffirmationAction = ('gender_40' | string)[];
export type CountingRulesMethod = 'uio_stv' | string;

export interface ElectionBaseSettingsInput {
  id: any;
  seats: number;
  substitutes: number;
  active: boolean;
}

export interface ElectionVotingPeriodInput {
  id: any;
  start: any;
  end: any;
}

export interface ElectionVoterInfoInput {
  id: any;
  mandatePeriodStart: any;
  mandatePeriodEnd: any;
  contact: string;
  informationUrl: string;
}
