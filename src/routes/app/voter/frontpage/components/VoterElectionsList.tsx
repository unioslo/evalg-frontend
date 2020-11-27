import React from 'react';
import { useTranslation } from 'react-i18next';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import Button, { ButtonContainer } from 'components/button';
import { Date, Time } from 'components/i18n';
import Link from 'components/link';
import { ElectionGroup } from 'interfaces';

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
  hasVotingRights: boolean;
  classes: Classes;
}

const VoterElectionsListItem: React.FunctionComponent<IListItemProps> = (
  props: IListItemProps
) => {
  const { electionGroup, lang, hasVotingRights, classes } = props;
  const { t } = useTranslation();
  const election = electionGroup.elections[0];

  // We need data from the non-existing ballot-module to discern this
  // properly
  const hasVoted = false;

  const showVoteLink = electionGroup.status === 'ongoing';
  return (
    <li className={classes.listItem}>
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
          {hasVotingRights ? t('general.yes') : t('general.no')}
        </div>
      </div>
      {showVoteLink && (
        <ButtonContainer alignLeft>
          <Link to={`/vote/${electionGroup.id}`}>
            {!hasVoted ? (
              <Button text={t('election.voteNow')} />
            ) : (
              <Button secondary text={t('election.changeVote')} />
            )}
          </Link>
        </ButtonContainer>
      )}
    </li>
  );
};

interface IListProps {
  electionGroups: Array<ElectionGroup>;
  votingRightsElectionGroups: string[];
  noElectionsText: React.ReactElement;
  classes: Classes;
}

const VoterElectionsList: React.FunctionComponent<IListProps> = (
  props: IListProps
) => {
  const {
    electionGroups,
    noElectionsText,
    votingRightsElectionGroups,
    classes,
  } = props;
  const { i18n } = useTranslation();

  // const lang = props.i18n.language;
  if (electionGroups.length === 0) {
    return <p>{noElectionsText}</p>;
  }
  return (
    <ul className={classes.list}>
      {electionGroups.map(group => (
        <VoterElectionsListItem
          classes={classes}
          electionGroup={group}
          hasVotingRights={votingRightsElectionGroups.includes(group.id)}
          lang={i18n.language}
          key={group.id}
        />
      ))}
    </ul>
  );
};

export default injectSheet(styles)(VoterElectionsList);
