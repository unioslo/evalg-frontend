import generalText from './general.en';

const { election, general, ...restGeneral} = generalText;

const electionVoter = {
  electionInfo: 'Election Information',
  candidates: 'Candidates',
  census: 'Census',
  electionStatus: 'Election Status',
  canVote: 'Can vote',
  voteNow: 'Vote now',
  changeVote: 'Change vote'
};

const generalVoter = {
  welcome: 'Welcome to eValg',
  frontPageDesc: 'Here you can vote in electronic elections.',
  ongoingElections: 'Ongoing elections',
  upcomingElections: 'Upcoming elections',
  finishedElections: 'Finished elections',
  noOngoingElections: 'There are no ongoing elections.',
  noUpcomingElections: 'There are no upcoming elections.',
  noClosedElections: 'There are no finished elections.'
};

export default {
  ...restGeneral,
  type: 'voter',
  election: Object.assign({}, election, { ...electionVoter }),
  general: Object.assign({}, general, { ...generalVoter })
}
