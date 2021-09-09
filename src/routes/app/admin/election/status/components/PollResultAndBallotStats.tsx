import React from 'react';
import { Classes } from 'jss';
import { createUseStyles, useTheme } from 'react-jss';
import { useTranslation } from 'react-i18next';

import { ElectionResult, Candidate } from 'interfaces';
import { H4 } from 'components/text';

const useStyles = createUseStyles((theme: any) => ({
  sectionLevel1: {
    marginBottom: '2rem',
  },
  sectionLevel2: {
    '&:not(:last-child)': {
      marginBottom: '1.5rem',
    },
  },
  candidatesList: {
    listStylePosition: 'inside',
  },
  substituteCandidatesList: {
    listStyle: 'none',
  },
  candidateListItem: {
    lineHeight: '1.5',
  },
  errorText: {
    color: theme.errorTextColor,
  },
}));

interface IProps {
  electionResult: ElectionResult;
}

const PollResultAndBallotStats: React.FunctionComponent<IProps> = ({
  electionResult,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const theme = useTheme();
  const classes = useStyles({ theme });

  const { election } = electionResult;
  const { pollbooks } = election;
  const { result } = electionResult;

  return (
    <>
      <div className={classes.sectionLevel1}>
        <H4>{t('admin.countingDetails.electionResult.electionResult')}</H4>
        <>
          <div className={classes.sectionLevel2}>
            {Object.keys(result['alternatives']).length > 0 ? (
              <ul className={classes.candidatesList}>
                <PollResultList
                  alternatives={result['alternatives']}
                  candidates={election.lists[0].candidates}
                  classes={classes}
                />
              </ul>
            ) : (
              <em>{t('admin.pollElec.noResults')}</em>
            )}
          </div>
        </>
      </div>

      <div className={classes.sectionLevel1}>
        <H4>{t('admin.countingDetails.electionResult.numberOfVotes')}</H4>
        {pollbooks.map((pollbook) => {
          const pollbookBallotStats = result['meta']['pollbooks'].find(
            (pollbookBallotStats: any) => pollbookBallotStats.id === pollbook.id
          );
          if (!pollbookBallotStats)
            return (
              <span key={pollbook.id} className={classes.errorText}>
                {t(
                  'admin.countingDetails.electionResult.errors.couldNotGetNumberOfVotesData'
                )}
              </span>
            );
          const ballotsCount = pollbookBallotStats['ballots_count'];
          const blankBallotsCount = pollbookBallotStats['empty_ballots_count'];
          const countingBallotsCounts = ballotsCount - blankBallotsCount;
          return (
            <React.Fragment key={pollbook.id}>
              <div className={classes.sectionLevel2}>
                {pollbooks.length > 1 ? (
                  <>
                    <strong>{pollbook.name[lang]}:</strong>{' '}
                  </>
                ) : null}
                {t('admin.countingDetails.electionResult.countCastVotes', {
                  count: ballotsCount,
                })}
                {', '}
                {t('admin.countingDetails.electionResult.ofWhich')}{' '}
                {t('admin.countingDetails.electionResult.countCountingVotes', {
                  count: countingBallotsCounts,
                })}{' '}
                {t('general.and')}{' '}
                {t('admin.countingDetails.electionResult.countBlankVotes', {
                  count: blankBallotsCount,
                })}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

interface PollResultProps {
  alternatives: string[];
  candidates: Candidate[];
  classes: Classes;
}

const PollResultList: React.FunctionComponent<PollResultProps> = ({
  alternatives,
  candidates,
  classes,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {Object.entries(alternatives).map((alternative) => {
        const electedCandidate = candidates.find(
          (candidate) => candidate.id === alternative[0]
        );
        let candidateResultText = '';
        if (electedCandidate) {
          // For backward compatibility
          if (typeof alternative[1] === 'string') {
            candidateResultText = `${alternative[1]}% - ${electedCandidate.name}`;
          } else {
            candidateResultText = `${alternative[1]['votes']} ${t(
              'election.votes'
            )} (${alternative[1]['percent']} %) - ${electedCandidate.name}`;
          }

          return (
            <li key={alternative[0]} className={classes.candidateListItem}>
              {candidateResultText}
            </li>
          );
        }
        return (
          <li key={alternative[0]}>
            <span className={classes.errortext}>
              {t(
                'admin.countingDetails.electionResult.errors.candidateNameNotFound'
              )}
            </span>{' '}
            ({alternative[0]})
          </li>
        );
      })}
    </>
  );
};

export default PollResultAndBallotStats;
