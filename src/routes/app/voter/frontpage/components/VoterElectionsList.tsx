import * as React from 'react';
import { useTranslation } from 'react-i18next';
import injectSheet from 'react-jss';

import Button, { ButtonContainer } from '../../../../../components/button';
import { Date, Time } from '../../../../../components/i18n';
import Link from '../../../../../components/link';
import { ElectionGroup } from '../../../../../interfaces';
import { Classes } from 'jss';

const styles = (theme: any) => ({
  list: {
    width: '100%',
    listStyleType: 'none',
    fontSize: '1.7rem',
    borderTop: `3px solid ${theme.colors.lightBlueGray}`,
    lineHeight: 1.6,
    marginTop: '2rem',
  },
  listItem: {
    borderBottom: `3px solid ${theme.colors.lightBlueGray}`,
    paddingTop: '1.5rem',
    paddingBottom: '3rem',
  },
});

interface IListItemProps {
  electionGroup: ElectionGroup;
  lang: string;
  canVote: boolean;
  classes: Classes;
}

function VoterElectionsListItem(props: IListItemProps) {
  const { electionGroup, lang, canVote } = props;
  const { t } = useTranslation();
  const election = electionGroup.elections[0];

  // We need data from the non-existing ballot-module to discern this
  // properly
  const hasVoted = false;

  return (
    <li className={props.classes.listItem}>
      <h3>
        <b>{electionGroup.name[lang]}</b>
      </h3>
      <div>
        <div>
          {t('election.opens')}:&nbsp;
          <Date dateTime={election.start} longDate />
          &nbsp;
          <Time dateTime={election.start} />
        </div>
        <div>
          {t('election.closes')}:&nbsp;
          <Date dateTime={election.end} longDate />
          &nbsp;
          <Time dateTime={election.end} />
        </div>
        <div>
          {t('election.rightToVote')}:&nbsp;
          {canVote ? t('general.yes') : t('general.no')}
        </div>
      </div>
      <ButtonContainer alignLeft>
        <Link to={`/vote/${electionGroup.id}`}>
          {!hasVoted ? (
            <Button text={t('election.voteNow')} />
          ) : (
            <Button secondary={true} text={t('election.changeVote')} />
          )}
        </Link>
      </ButtonContainer>
    </li>
  );
}

interface IListProps {
  electionGroups: Array<ElectionGroup>;
  canVoteElectionGroups: string[];
  noElectionsText: React.ReactElement;
  classes: Classes;
}

export function VoterElectionsList(props: IListProps) {
  const { electionGroups, noElectionsText, classes } = props;
  const { i18n } = useTranslation();

  // const lang = props.i18n.language;
  if (electionGroups.length === 0) {
    return <p>{noElectionsText}</p>;
  }
  return (
    <ul className={classes.list}>
      {electionGroups.map((group, index) => (
        <VoterElectionsListItem
          classes={classes}
          electionGroup={group}
          canVote={props.canVoteElectionGroups.includes(group.id)}
          lang={i18n.language}
          key={index}
        />
      ))}
    </ul>
  );
}

export default injectSheet(styles)(VoterElectionsList);
