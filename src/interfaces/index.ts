// Local state stuff

export interface EvalgClientState {
  admin: { isCreatingNewElection: boolean };
}

// Graphql entity types

export type Viewer = {
  person: IPerson;
  roles: [IRoleGrant];
};

// Query responses

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

export type PersonIdType = 'feide_id' | 'uid' | 'nin';

export interface IPersonIdentifier {
  personId: string;
  idType: PersonIdType;
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

export interface IRoleGrant {
  __typename: string;
  grantId: string;
  name: string;
  principal: Principal;
}

export interface IVoter {
  id: string;
  idType: PersonIdType;
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
  hasVoted: boolean;
}

export interface IVote {
  voterId: string;
  ballotId: string;
  voter: IVoter;
}

export interface ICensusFileImport {
  id: string;
  pollbookId: string;
  pollbook: IPollBook;
  fileName: string;
  mimeType: string;
  importResults: string;
  initiatedAt: string;
  finishedAt: string;
  status: string;
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
  censusFileImports: ICensusFileImport[];
  nrOfVoters: number;
  voterDump: string[][];
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
    coCandidates?: CoCandidate[];
    gender?: 'male' | 'female';
  };
}

export interface CoCandidate {
  name: string;
}

export interface ElectionList {
  id: string;
  election: Election;
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
  isLocked: boolean;
  tz: string;
  lists: ElectionList[];
}

export interface ElectionGroup {
  id: string;
  type: 'single_election' | 'multiple_elections'; // TODO: Are there more possibilities?
  name: NameFields;
  start: string | null;
  end: string | null;
  personsWithMultipleVerifiedVoters: IVoter[];
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

export type PrincipalType =
  | 'PersonPrincipal'
  | 'PersonIdentifierPrincipal'
  | 'GroupPrincipal';

export type Principal =
  | IPersonPrincipal
  | IPersonIdentifierPrincipal
  | IGroupPrincipal;

export interface IPersonPrincipal {
  __typename: 'PersonPrincipal';
  person: IPerson;
}

export interface IPersonIdentifierPrincipal {
  __typename: 'PersonIdentifierPrincipal';
  idType: PersonIdType;
  idValue: string;
}

export interface IGroupPrincipal {
  __typename: 'GroupPrincipal';
  group: IGroup;
}

export type ElectionGroupRoleType = 'admin' | 'publisher' | 'global_admin';

export interface IElectionGroupRole extends IRoleGrant {
  groupId: string;
  name: ElectionGroupRoleType;
  globalRole: boolean;
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
