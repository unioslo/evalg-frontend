import { Candidate } from 'interfaces';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme, createUseStyles } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
  list: {
    marginTop: '1.5rem',
    marginRight: '2rem',
    [theme.breakpoints.notMobileQuery]: {
      marginTop: '3rem',
    },
  },
  listItem: {
    alignItems: 'center',
    borderBottom: '2px solid #CCC',
    display: 'flex',
    padding: '1.2rem 0',
    paddingLeft: '2rem',
    paddingTop: '2rem',
    paddingBottom: '2rem',
    [theme.breakpoints.notMobileQuery]: {
      borderBottom: '1px solid #CCC',
      '&:first-child': {
        borderTop: '1px solid #CCC',
      },
    },
  },
  subSectionHeader: theme.subSectionHeader,
  ballotContainer: {
    display: 'flex',
    marginLeft: '2rem',
  },
  priority: {
    fontSize: '2.5rem',
    paddingRight: '2rem',
  },
  ballotListContainer: {
    display: 'flex',
    flexGrow: '1',
    justifyContent: 'space-between',
  },
  ballotMainContainer: {
    display: 'flex',
    marginLeft: '2rem',
  },
  candidate: {
    fontSize: '1.8rem',
    marginBottom: '0.8rem',
  },
  preCumulatedCandidate: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '0.8rem',
  },
  preCumulatedText: {
    marginRight: '2rem',
  },
}));

export function ElectionListList({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return <ul className={classes.list}>{children}</ul>;
}

export function ElectionListItem({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return <li className={classes.listItem}>{children}</li>;
}

interface CandidateListProps {
  candidates: Candidate[];
  noHeader?: boolean;
}

export function CandidateList(props: CandidateListProps) {
  const { candidates, noHeader } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <div>
      {!noHeader && (
        <span className={classes.subSectionHeader}>
          {t('voter.listVote.candidates')}
        </span>
      )}
      <ul className={classes.list}>
        {candidates.map((candidate, index) => {
          return (
            <li className={classes.listItem} key={candidate.id}>
              <div className={classes.ballotListContainer}>
                <div className={classes.ballotMainContainer}>
                  <div className={classes.priority}>{index + 1}</div>
                  <div>
                    {candidate.preCumulated ? (
                      <div className={classes.preCumulatedCandidate}>
                        {candidate.name}
                      </div>
                    ) : (
                      <div className={classes.candidate}>{candidate.name}</div>
                    )}
                    <div>{candidate.meta.fieldOfStudy}</div>
                  </div>
                </div>

                {candidate.preCumulated && (
                  <div className={classes.preCumulatedText}>
                    {t('voter.listVote.preCumulated')}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

CandidateList.defaultProps = {
  noHeader: false,
};
