interface IReactJSS {
  ThemeProvider: any,
  default: (styles: object) => (c: JSX.Element | React.SFC) => JSX.Element
}

declare module 'react-jss' {
  var _a: IReactJSS;
  export = _a;
}

interface NameFields {
  nb: string,
  nn: string,
  en: string
}

type ElectionStatusType = "closed" | "published" | "draft" | "announced" |
  "ongoing" | "cancelled" | "multipleStatuses"

type Election = {
  id: number,
  name: NameFields,
  start: string,
  end: string,
  votesOutsideCensus: number,
  totalVotes: number,
  status: ElectionStatusType,
  pollbooks: Array<string>,
  meta: object,
  active: boolean,
  mandatePeriodStart: string,
  mandatePeriodEnd: string,
  contact: string,
  informationUrl: string,
  tz: string,
  lists: Array<string>,
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
  elections: Array<Election>,
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

