import React from 'react';
import { useTranslation } from 'react-i18next';
import FileSaver from 'file-saver';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import { ElectionGroupCount } from '../../../../../../interfaces';
import { orderElectionResults } from '../../../../../../utils/processGraphQLData';

const styles = (theme: any) => ({
  electionSection: {
    marginBottom: '2rem',
    borderBottom: `1px solid ${theme.tableCandidateBottomBorderColor}`,
    paddingBottom: '2rem',
    '& div': {
      '&:not(:last-child)': {
        marginBottom: '2rem',
      }
    }
  },
  auditLogSubSection: {
    marginBottom: '2rem',
  },
  electionHeading: {
    marginBottom: '2rem',
  },
  subHeading: {
    marginBottom: '1rem',
  },
  votingPercantageRow: {
    marginBottom: '0.5rem',
  },
});

interface IProps {
  electionGroupCount: ElectionGroupCount;
  classes: Classes;
}

const CountDetails: React.FunctionComponent<IProps> = ({
  electionGroupCount,
  classes,
}) => {
  const { i18n, t } = useTranslation();

  const lang = i18n.language;
  let electionResults = electionGroupCount.electionResults;
  electionResults = orderElectionResults(electionResults);

  return (
    <>
      {electionResults.map(electionResult => {
        const electionName = electionResult.election.name[lang];
        const pollbooks = electionResult.election.pollbooks;
        const isActiveElection = electionResult.election.active;

        if (!isActiveElection) {
          return null;
        }

        return (
          <div key={electionResult.id} className={classes.electionSection}>
            {electionResults.length > 1 && (
              <h3 className={classes.electionHeading}>{electionName}</h3>
            )}
            <div>
              <h4 className={classes.subHeading}>{t('Resultat')}</h4>
              <em>Valgresultat</em>
            </div>
            <div>
              <h4 className={classes.subHeading}>{t('Valgoppslutning')}</h4>

              {pollbooks.map(pollbook => (
                <div key={pollbook.id} className={classes.votingPercantageRow}>
                  {pollbooks.length > 1 && (
                    <strong>{pollbook.name[lang]}: </strong>
                  )}
                  <em>x stemmer av x i manntall, x %</em>
                </div>
              ))}
            </div>
            <div>
              {t('Opptellingsprotokoll')}: <a href="#">{t('Last ned')}</a> |{' '}
              {t('Stemmesedler')}: <a onClick={() => {
                const blob = new Blob([JSON.stringify(electionResult.votes, null, 2)], {
                  type: 'application/json;charset=utf-8',
                });
                FileSaver.saveAs(blob, 'votes.json');
              }}>{t('Last ned (JSON)')}</a>
            </div>
          </div>
        );
      })}
      <div className={classes.auditLogSubSection}>
        {electionResults.length > 1
          ? t('Audit-log for alle valgene frem til opptellingen')
          : t('Audit-log for valget frem til opptellingen')}
        : <a href="#">{t('Last ned')}</a>
      </div>
    </>
  );
};

export default injectSheet(styles)(CountDetails);
