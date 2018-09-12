type JSSProps = {
  classes: any
}

declare module 'react-jss' {
  export const ThemeProvider: any

  function injectSheet(styles: any): (component: any) => any
  export default injectSheet;
}

interface NameFields {
  nb: string,
  nn: string,
  en: string
}

type ElectionStatusType = "closed" | "published" | "draft" | "announced" |
  "ongoing" | "cancelled" | "multipleStatuses"

interface IPerson {
  id: string,
  firstName: string,
  lastName: string,
  nin: string
}

interface IVoter {
  id: string,
  person: IPerson,
  pollbookId: string
}

interface IPollBook {
  id: string,
  name: NameFields,
  weight: number,
  priority: number,
  voters: IVoter[]
}

type Candidate = {
  id: string,
  name: string,
  listId: string,
  informationUrl: string,
  priority: number,
  preCumulated: boolean,
  meta: {
    coCandidates?: Array<string>
  }
}

type ElectionList = {
  id: string,
  name: NameFields,
  description: NameFields,
  informationUrl: string,
  candidates: Candidate[]
}

type Election = {
  id: number,
  name: NameFields,
  start: string,
  end: string,
  votesOutsideCensus: number,
  totalVotes: number,
  status: ElectionStatusType,
  pollbooks: IPollBook[],
  meta: object,
  active: boolean,
  mandatePeriodStart: string,
  mandatePeriodEnd: string,
  contact: string,
  informationUrl: string,
  tz: string,
  lists: ElectionList[],
}



interface ElectionGroup {
  id: number,
  type: string,
  name: NameFields,
  start: string | null,
  end: string | null,
  mandatePeriodStart: string,
  mandatePeriodEnd: string,
  meta: Object,
  hasMultipleMandateTimes: boolean,
  hasMultipleVotingTimes: boolean,
  hasMultipleElections: boolean,
  canModifyElections: boolean,
  elections: Election[],
  status: ElectionStatusType,
  hasGenderQuota: boolean,
  hasMultipleContactInfo: boolean,
  hasMultipleInfoUrls: boolean,
  hasMultipleCandidateLists: boolean,
  contact: string,
  informationUrl: string,
  tz: string,
  roles: Array<Object>,
  publicKey: string,
  announced: boolean,
  published: boolean,
  announcementBlockers: Array<string>,
  publicationBlockers: Array<string>,
}

