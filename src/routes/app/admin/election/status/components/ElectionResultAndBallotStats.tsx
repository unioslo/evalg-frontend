import React from 'react';
import { Classes } from 'jss';
import { useTranslation } from 'react-i18next';
import injectSheet from 'react-jss';

import { ElectionResult, Candidate } from 'interfaces';

const styles = (theme: any) => ({
  sectionLevel1: {
    marginBottom: '1.5rem',
  },
  sectionLevel2: {
    '&:not(:last-child)': {
      marginBottom: '1.5rem',
    },
  },
  subHeading: {
    marginBottom: '1rem',
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
});

interface IProps {
  electionResult: ElectionResult;
  classes: Classes;
}

const ElectionResultAndBallotStats: React.FunctionComponent<IProps> = ({
  electionResult,
  classes,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const election = electionResult.election;
  const pollbooks = election.pollbooks;
  const result = electionResult.result;
  const pollbookStats = electionResult.pollbookStats;

  return (
    <>
      <div className={classes.sectionLevel1}>
        <h3 className={classes.subHeading}>
          {t('admin.countingDetails.electionResult.electionResult')}
        </h3>
        <>
          <div className={classes.sectionLevel2}>
            <h4 className={classes.subHeading}>
              {result['regular_candidates'].length === 1
                ? t('admin.countingDetails.electionResult.electedCandidate')
                : t('admin.countingDetails.electionResult.electedCandidates')}
            </h4>
            {result['regular_candidates'].length > 0 ? (
              <ul className={classes.candidatesList}>
                <ElectedCandidatesList
                  electedCandidateIds={result['regular_candidates']}
                  candidates={election.lists[0].candidates}
                  classes={classes}
                />
              </ul>
            ) : (
              <em>
                {t('admin.countingDetails.electionResult.noElectedCandidates')}
              </em>
            )}
          </div>

          {result['substitute_candidates'].length > 0 ? (
            <div className={classes.sectionLevel2}>
              <>
                <h4 className={classes.subHeading}>
                  {t(
                    'admin.countingDetails.electionResult.electedSubstituteCandidates'
                  )}
                </h4>
                <ol className={classes.substituteCandidatesList}>
                  <ElectedCandidatesList
                    electedCandidateIds={result['substitute_candidates']}
                    candidates={election.lists[0].candidates}
                    isSubistitutesList
                    classes={classes}
                  />
                </ol>
              </>
            </div>
          ) : null}

          <div className={classes.sectionLevel2}>
            <strong>
              {t('admin.countingDetails.electionResult.drawing')}:
            </strong>{' '}
            {result['meta']['drawing'] ? t('general.yes') : t('general.no')}
          </div>
        </>
      </div>

      <div className={classes.sectionLevel1}>
        <h3 className={classes.subHeading}>
          {t('admin.countingDetails.electionResult.numberOfVotes')}
        </h3>
        {pollbooks.map(pollbook => {
          const statsForPollbook = pollbookStats[pollbook.id];
          if (!statsForPollbook)
            return (
              <span key={pollbook.id} className={classes.errorText}>
                {t(
                  'admin.countingDetails.electionResult.errors.couldNotGetNumberOfVotesData'
                )}
              </span>
            );
          const ballotsCount = statsForPollbook['ballots_count'];
          const countingBallotsCounts =
            statsForPollbook['counting_ballots_count'];
          const blankBallotsCount = statsForPollbook['empty_ballots_count'];
          return (
            <>
              <div key={pollbook.id} className={classes.sectionLevel2}>
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
            </>
          );
        })}
      </div>
    </>
  );
};

interface ElectedCandidatesListProps {
  electedCandidateIds: string[];
  candidates: Candidate[];
  isSubistitutesList?: boolean;
  classes: Classes;
}

const ElectedCandidatesList: React.FunctionComponent<
  ElectedCandidatesListProps
> = ({ electedCandidateIds, candidates, isSubistitutesList, classes }) => {
  const { t } = useTranslation();

  return (
    <>
      {electedCandidateIds.map((electedCandidateId, index) => {
        const electedCandidate = candidates.find(
          candidate => candidate.id === electedCandidateId
        );
        if (electedCandidate) {
          return (
            <li key={electedCandidateId} className={classes.candidateListItem}>
              {isSubistitutesList ? (
                <>
                  <em>
                    {t('admin.countingDetails.electionResult.nthSubstitute', {
                      count: index + 1,
                    })}
                  </em>
                  :{' '}
                </>
              ) : null}
              {electedCandidate.name}
            </li>
          );
        } else {
          return (
            <li key={electedCandidateId}>
              <span className={classes.errortext}>
                {t(
                  'admin.countingDetails.electionResult.errors.candidateNameNotFound'
                )}
              </span>{' '}
              ({electedCandidateId})
            </li>
          );
        }
      })}
    </>
  );
};

export default injectSheet(styles)(ElectionResultAndBallotStats);
