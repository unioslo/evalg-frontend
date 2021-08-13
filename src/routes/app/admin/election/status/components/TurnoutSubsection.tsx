import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { useTranslation } from 'react-i18next';
import { Classes } from 'jss';
import { createUseStyles, useTheme } from 'react-jss';

import { IPollBook, Election } from 'interfaces';

import { PageSubSection } from 'components/page';
import Loading from 'components/loading';

const POLL_INTERVAL_MS = 30000;

const turnoutCountsQuery = gql`
  query turnoutCounts($id: UUID!) {
    electionGroup(id: $id) {
      id
      type
      elections {
        id
        active
        pollbooks {
          id
          name
          verifiedVotersCount
          verifiedVotersWithVotesCount
        }
      }
    }
  }
`;

const useStyles = createUseStyles((theme: any) => ({
  turnoutSubSectionContent: {
    marginTop: '2rem',
  },
  votingTurnoutRow: {
    '&:not(:last-child)': {
      marginBottom: '1.5rem',
    },
  },
  errorText: {
    color: theme.errorTextColor,
  },
}));

interface IProps {
  electionGroupId: string;
  doPolling: boolean;
}

const TurnoutSubsection: React.FunctionComponent<IProps> = ({
  electionGroupId,
  doPolling,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <PageSubSection header={t('admin.statusSection.turnoutSubsection.header')}>
      <div className={classes.turnoutSubSectionContent}>
        <Query
          query={turnoutCountsQuery}
          variables={{ id: electionGroupId }}
          fetchPolicy="network-only"
          pollInterval={doPolling ? POLL_INTERVAL_MS : 0}
        >
          {(result: any) => {
            const { data, loading, error } = result;
            if (loading) {
              return <Loading />;
            }
            if (error) {
              console.error(error);
              return (
                <span className={classes.errorText}>
                  {t('admin.statusSection.turnoutSubsection.errors.general')}.
                </span>
              );
            }

            const { electionGroup } = data;

            return electionGroup.type === 'single_election'
              ? electionGroup.elections[0].pollbooks.map(
                  (pollbook: IPollBook) => (
                    <TurnoutRow
                      key={pollbook.id}
                      pollbookName={pollbook.name[lang]}
                      votersCount={Number(pollbook.verifiedVotersCount)}
                      votersWithVotesCount={Number(
                        pollbook.verifiedVotersWithVotesCount
                      )}
                      classes={classes}
                    />
                  )
                )
              : electionGroup.elections
                  .filter((election: Election) => election.active)
                  .map((election: Election) => (
                    <TurnoutRow
                      key={election.id}
                      pollbookName={election.pollbooks[0].name[lang]}
                      votersCount={Number(
                        election.pollbooks[0].verifiedVotersCount
                      )}
                      votersWithVotesCount={Number(
                        election.pollbooks[0].verifiedVotersWithVotesCount
                      )}
                      classes={classes}
                    />
                  ));
          }}
        </Query>
      </div>
    </PageSubSection>
  );
};

interface ITurnoutRowProps {
  pollbookName: string;
  votersCount: number;
  votersWithVotesCount: number;
  classes: Classes;
}

const TurnoutRow: React.FunctionComponent<ITurnoutRowProps> = ({
  pollbookName,
  votersCount,
  votersWithVotesCount,
  classes,
}) => {
  const { t } = useTranslation();

  return (
    <div className={classes.votingTurnoutRow}>
      <strong>{pollbookName}: </strong>
      {votersCount > 0 ? (
        <span>
          {t(
            'admin.statusSection.turnoutSubsection.countPersonsHasVotedOfVotersInCensus',
            {
              count: votersWithVotesCount,
              votersCount,
            }
          )}{' '}
          ({Math.round((votersWithVotesCount / votersCount) * 10000) / 100} %)
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

export default TurnoutSubsection;
