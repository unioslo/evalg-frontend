import * as React from 'react';

import { Trans, translate } from 'react-i18next';

import { Date, Time } from 'components/i18n';
import Button, { ButtonContainer } from 'components/button';

type ListItemProps = {
  electionGroup: Object,
  elections: Object,
  lang: string
}

const VoterElectionsListItem = (props: ListItemProps) => {
  const { electionGroup, lang } = props;
  const election = props.elections[electionGroup.elections[0]];
  const canVote = true;
  const hasVoted = false;

  return (
    <li className="voterelectionslist--item">
      <h3><b>{electionGroup.name[lang]}</b></h3>
      <div className="voterelectionslist--item--infosection">
        <div>
          <Trans>election.opens</Trans>:&nbsp;
          <Date date={election.startDate} />&nbsp;
          <Time time={election.startTime} />
        </div>
        <div>
          <Trans>election.closes</Trans>:&nbsp;
          <Date date={election.endDate} />&nbsp;
          <Time time={election.endTime} />
        </div>
        <div>
          <Trans>election.canVote</Trans>:&nbsp;
          {canVote ? <Trans>general.yes</Trans> :
            <Trans>general.no</Trans>
          }
        </div>
      </div>
      <ButtonContainer alignLeft>
        {!hasVoted ?
          <Button primary text={<Trans>election.voteNow</Trans>}
            action={() => console.error('NEW VOTE')}
          /> :
          <Button secondary text={<Trans>election.changeVote</Trans>}
            action={() => console.error('CHANGE VOTE')}
          />
        }
      </ButtonContainer>
    </li>
  )
};

type ListProps = {
  electionGroups: Array<ElectionGroup>,
  elections: Object,
  noElectionsText: ReactElement,
  lang: string
}

const VoterElectionsList = (props: ListProps) => {
  const { electionGroups, elections, lang, noElectionsText } = props;
  if (electionGroups.length === 0) {
    return (
      <p>{noElectionsText}</p>
    )
  }
  return (
    <ul className="voterelectionslist">
      {electionGroups.map((group, index) =>
        <VoterElectionsListItem electionGroup={group}
          elections={elections}
          lang={lang}
          key={index}
        />
      )}
    </ul>
  )
};

export default translate()(VoterElectionsList);