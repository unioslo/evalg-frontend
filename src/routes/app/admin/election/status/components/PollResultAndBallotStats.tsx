import React from 'react';
import { Classes } from 'jss';
import { useTranslation } from 'react-i18next';
import injectSheet from 'react-jss';

import { ElectionResult, Candidate } from 'interfaces';
import { H4, H5 } from 'components/text';

const styles = (theme: any) => ({
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
});

interface IProps {
  electionResult: ElectionResult;
  classes: Classes;
}

const PollResultAndBallotStats: React.FunctionComponent<IProps> = ({
  electionResult,
  classes,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { election } = electionResult;
  const { pollbooks } = election;
  const { result } = electionResult;

  console.info(result.alternatives);
  console.info(result.alternatives.size);

  return (
    <>
      <div className={classes.sectionLevel1}>
        <H4>{t('admin.countingDetails.electionResult.electionResult')}</H4>
        <>
          <div className={classes.sectionLevel2}>
            <H5>
              {Object.keys(result['alternatives']).length === 1
                ? t('admin.countingDetails.electionResult.electedCandidate')
                : t('admin.countingDetails.electionResult.electedCandidates')}
            </H5>
            {Object.keys(result['alternatives']).length > 0 ? (
              <ul className={classes.candidatesList}>
                <PollResultList
                  electedCandidateIds={result['alternatives']}
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
        </>
      </div>

      <div className={classes.sectionLevel1}>
        <H4>{t('admin.countingDetails.electionResult.numberOfVotes')}</H4>
        {pollbooks.map(pollbook => {
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

interface ElectedCandidatesListProps {
  electedCandidateIds: string[];
  candidates: Candidate[];
  classes: Classes;
}

const PollResultList: React.FunctionComponent<ElectedCandidatesListProps> = ({
  electedCandidateIds,
  candidates,
  classes,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {electedCandidateIds.map(electedCandidateId => {
        const electedCandidate = candidates.find(
          candidate => candidate.id === electedCandidateId
        );
        if (electedCandidate) {
          return (
            <li key={electedCandidateId} className={classes.candidateListItem}>
              {electedCandidate.name}
            </li>
          );
        }
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
      })}
    </>
  );
};

export default injectSheet(styles)(PollResultAndBallotStats);
