type JSSProps = {
  classes: any;
};

declare module 'react-jss' {
  export const ThemeProvider: any;

  function injectSheet(styles: any): (component: any) => any;
  export default injectSheet;
}

interface NameFields {
  nb: string;
  nn: string;
  en: string;
}

interface DropDownOption {
  name: string;
  value: any;
}

type ElectionStatusType =
  | 'closed'
  | 'published'
  | 'draft'
  | 'announced'
  | 'ongoing'
  | 'cancelled'
  | 'multipleStatuses';

interface IPerson {
  id: string;
  firstName: string;
  lastName: string;
  nin: string;
}

interface IVoter {
  id: string;
  person: IPerson;
  pollbookId: string;
}

interface IPollBook {
  id: string;
  name: NameFields;
  weight: number;
  priority: number;
  voters: IVoter[];
}

interface Candidate {
  id: string;
  name: string;
  listId: string;
  list: ElectionList;
  informationUrl: string;
  priority: number;
  preCumulated: boolean;
  meta: {
    coCandidates?: Array<string>;
  };
}

interface ElectionList {
  id: string;
  name: NameFields;
  description: NameFields;
  informationUrl: string;
  candidates: Candidate[];
}

interface Election {
  id: number;
  name: NameFields;
  start: string;
  end: string;
  votesOutsideCensus: number;
  totalVotes: number;
  status: ElectionStatusType;
  pollbooks: IPollBook[];
  meta: ElectionMetaData;
  electionGroup?: ElectionGroup;
  active: boolean;
  mandatePeriodStart: string;
  mandatePeriodEnd: string;
  contact: string;
  informationUrl: string;
  tz: string;
  lists: ElectionList[];
}

interface ElectionGroup {
  id: number;
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
type ElectionMetaData = {
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
type BallotRulesVotes = 'all' | string;
type BallotRulesVoting = 'rank_candidates' | string;
type CandidateType = 'single' | string;
type CountingRulesAffirmationAction = ('gender_40' | string)[];
type CountingRulesMethod = 'uio_stv' | string;

interface ElectionBaseSettingsInput {
  id: any;
  seats: number;
  substitutes: number;
  active: boolean;
}

interface ElectionVotingPeriodInput {
  id: any;
  start: any;
  end: any;
}

interface ElectionVoterInfoInput {
  id: any;
  mandatePeriodStart: any;
  mandatePeriodEnd: any;
  contact: string;
  informationUrl: string;
}
