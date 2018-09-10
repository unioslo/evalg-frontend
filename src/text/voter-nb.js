import generalText from './general.nb';

const { election, general, ...restGeneral} = generalText;

const electionVoter = {
  electionInfo: 'Valginformasjon',
  candidates: 'Kandidater',
  census: 'Manntall',
  electionStatus: 'Valgstatus',
  canVote: 'Stemmerett',
  voteNow: 'Stem nå',
  changeVote: 'Endre stemme'
};

const generalVoter = {
  welcome: 'Velkommen til eValg',
  frontPageDesc: 'Her kan du stemme i elektroniske valg.',
  ongoingElections: 'Pågående valg',
  upcomingElections: 'Kommende valg',
  finishedElections: 'Avsluttede valg',
  noOngoingElections: 'Det er ingen pågående valg.',
  noUpcomingElections: 'Det er ingen kommende valg.',
  noClosedElections: 'Det er ingen avsluttede valg.'
};

export default {
  ...restGeneral,
  type: 'voter',
  election: Object.assign({}, election, { ...electionVoter }),
  general: Object.assign({}, general, { ...generalVoter })
}
