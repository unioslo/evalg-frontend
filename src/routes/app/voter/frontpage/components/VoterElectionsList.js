import * as React from 'react';
import { Trans, translate } from 'react-i18next';

import Button, { ButtonContainer } from 'components/button';
import { Date, Time } from 'components/i18n';
import Link from 'components/link';

type ListItemProps = {
  electionGroup: ElectionGroup,
  lang: string
}

const VoterElectionsListItem = (props: ListItemProps) => {
  const { electionGroup, lang } = props;
  const election = electionGroup.elections[0];
  const canVote = true;
  // We need data from the non-existing ballot-module to discern this
  // properly
  const hasVoted = false;

  return (
    <li className="voterelectionslist--item">
      <h3><b>{electionGroup.name[lang]}</b></h3>
      <div className="voterelectionslist--item--infosection">
        <div>
          <Trans>election.opens</Trans>:&nbsp;
          <Date dateTime={election.start} />&nbsp;
          <Time dateTime={election.start} />
        </div>
        <div>
          <Trans>election.closes</Trans>:&nbsp;
          <Date dateTime={election.end} />&nbsp;
          <Time dateTime={election.end} />
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
          <Link to={`/voter/elections/${election.id}/vote`}>
            <Trans>election.voteNow</Trans>&nbsp;
          </Link> :
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
  noElectionsText: ReactElement,
  i18n: object
}

const VoterElectionsList = (props: ListProps) => {
  const { electionGroups, elections, noElectionsText } = props;
  const lang = props.i18n.language;
  if (electionGroups.length === 0) {
    return (
      <p>{noElectionsText}</p>
    )
  }
  return (
    <ul className="voterelectionslist">
      {electionGroups.map((group, index) =>
        <VoterElectionsListItem
          electionGroup={group}
          lang={props.i18n.language}
          key={index}
        />
      )}
    </ul>
  )
};

export default translate()(VoterElectionsList);