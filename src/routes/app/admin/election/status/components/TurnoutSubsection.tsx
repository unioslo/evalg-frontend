import React from 'react';
import { useTranslation } from 'react-i18next';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import { ElectionGroup } from 'interfaces';

import { PageSubSection } from 'components/page';

const styles = (theme: any) => ({
  turnoutSubSectionContent: {
    marginTop: '2rem',
  },
  votingTurnoutRow: {
    '&:not(:last-child)': {
      marginBottom: '1.5rem',
    },
  },
});

interface IProps {
  electionGroup: ElectionGroup;
  classes: Classes;
}

const TurnoutSubsection: React.FunctionComponent<IProps> = ({
  electionGroup,
  classes,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <PageSubSection header={t('admin.statusSection.turnoutSubsection.header')}>
      <div className={classes.turnoutSubSectionContent}>
        {electionGroup.type === 'single_election'
          ? electionGroup.elections[0].pollbooks.map(pollbook => (
              <TurnoutRow
                key={pollbook.id}
                pollbookName={pollbook.name[lang]}
                nVoters={Number(pollbook.nVerifiedVoters)}
                nVotersWithVotes={Number(pollbook.nVerifiedVotersWithVotes)}
                classes={classes}
              />
            ))
          : electionGroup.elections
              .filter(election => election.active)
              .map(election => (
                <TurnoutRow
                  key={election.id}
                  pollbookName={election.pollbooks[0].name[lang]}
                  nVoters={Number(election.pollbooks[0].nVerifiedVoters)}
                  nVotersWithVotes={Number(
                    election.pollbooks[0].nVerifiedVotersWithVotes
                  )}
                  classes={classes}
                />
              ))}
      </div>
    </PageSubSection>
  );
};

interface ITurnoutRowProps {
  pollbookName: string;
  nVoters: number;
  nVotersWithVotes: number;
  classes: Classes;
}

const TurnoutRow: React.FunctionComponent<ITurnoutRowProps> = ({
  pollbookName,
  nVoters,
  nVotersWithVotes,
  classes,
}) => {
  const { t } = useTranslation();

  return (
    <div className={classes.votingTurnoutRow}>
      <strong>{pollbookName}: </strong>
      {nVoters > 0 ? (
        <span>
          {nVotersWithVotes}{' '}
          {nVotersWithVotes === 1
            ? t('admin.statusSection.turnoutSubsection.personHasVotedOf')
            : t('admin.statusSection.turnoutSubsection.personsHasVotedOf')}{' '}
          {nVoters} {t('admin.statusSection.turnoutSubsection.inCensus')} (
          {Math.round((nVotersWithVotes / nVoters) * 10000) / 100} %)
        </span>
      ) : (
        <em>
          <span>
            {t('admin.statusSection.turnoutSubsection.censusIsEmpty')}
          </span>
        </em>
      )}
    </div>
  );
};

export default injectSheet(styles)(TurnoutSubsection);
