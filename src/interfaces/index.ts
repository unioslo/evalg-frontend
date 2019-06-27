// Local state stuff

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

// Graphql entity types

export type Viewer = {
  person: IPerson;
};

// Query responses

export type SignedInPersonResponse = {
  signedInPerson: SignedInPerson;
};

export type VotersForPersonResponse = {
  votersForPerson: IVoter[];
};

// Mutation response

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
  email: string;
  lastUpdate: string;
  lastUpdateFromFeide: string;
  identifiers: IPersonIdentifier[];
}

export interface IPersonIdentifier {
  personId: string;
  idType: string;
  idValue: string;
  person: IPerson;
}

export interface IPersonSearchResult {
  id: string;
  displayName: string;
}

export interface IGroup {
  id: string;
  name: string;
}

export interface IGroupSearchResult {
  id: string;
  name: string;
}

export interface IVoter {
  id: string;
  idType: string;
  idValue: string;
  pollbookId: string;
  pollbook: IPollBook;
  selfAdded: boolean;
  reviewed: boolean;
  verified: boolean;
  verifiedStatus:
    | 'ADMIN_ADDED_AUTO_VERIFIED'
    | 'ADMIN_ADDED_REJECTED'
    | 'SELF_ADDED_NOT_REVIEWED'
    | 'SELF_ADDED_VERIFIED'
    | 'SELF_ADDED_REJECTED';
  reason?: string;
  votes: IVote[];
  person?: IPerson | null;
}

export interface IVote {
  voterId: string;
  ballotId: string;
  voter: IVoter;
}

export interface IPollBook {
  id: string;
  name: NameFields;
  weight: number;
  priority: number;
  voters: IVoter[];
  adminAddedVoters: IVoter[];
  selfAddedVoters: IVoter[];
  verifiedVotersCount: number;
  verifiedVotersWithVotesCount: number;
  election: Election;
  votersWithVote: IVoter[];
  votersWithoutVote: IVoter[];
}

export interface IVoteCount {
  id: string;
  selfAddedNotReviewed: number;
  adminAddedRejected: number;
  selfAddedRejected: number;
  adminAddedAutoVerified: number;
  selfAddedVerified: number;
  total: number;
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
  voteCount: IVoteCount;
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
  roles: IElectionGroupRole[];
  publicKey: string;
  announced: boolean;
  published: boolean;
  announcementBlockers: string[];
  publicationBlockers: string[];
  latestElectionGroupCount: ElectionGroupCount;
}

export interface IElectionGroupRole {
  name: string;
  grantId: string;
  principal: IPrincipal;
}

export interface IPrincipal {
  principalType: 'person-principal' | 'group-principal';
  person: IPerson; // may actually be undefined, check principal type
  group: IGroup; // may actually be undefined, check principal type
}

export interface ElectionGroupCount {
  id: string;
  groupId: string;
  initiatedAt: string;
  finishedAt: string;
  initiatedBy: IPerson;
  audit: any;
  status: string;
  electionGroup: ElectionGroup;
  electionResults: ElectionResult[];
}

export interface ElectionResult {
  id: string;
  result: any;
  electionProtocol: any;
  ballots: any;
  ballotsWithMetadata: any;
  electionId: string;
  election: Election;
  electionGroupCountId: string;
  electionGroupCount: ElectionGroupCount;
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
