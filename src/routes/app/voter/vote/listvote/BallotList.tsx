import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme, createUseStyles } from 'react-jss';
import { ListBallot } from './ListVote';

const useStyles = createUseStyles((theme: any) => ({
  list: {
    marginTop: '1.5rem',
    [theme.breakpoints.notMobileQuery]: {
      marginTop: '3rem',
    },
  },
  listItem: {
    alignItems: 'center',
    borderBottom: '2px solid #CCC',
    display: 'flex',
    padding: '1.2rem 0',
    [theme.breakpoints.notMobileQuery]: {
      borderBottom: '1px solid #CCC',
      '&:first-child': {
        borderTop: '1px solid #CCC',
      },
    },
  },
  subSectionHeader: theme.subSectionHeader,

  ballotListContainer: {
    display: 'flex',
    flexGrow: '1',
    justifyContent: 'space-between',
  },

  ballotMainContainer: {
    display: 'flex',
    marginLeft: '2rem',
  },

  priority: {
    fontSize: '2.5rem',
    paddingRight: '2rem',
  },
  candidate: {
    fontSize: '1.5rem',
    marginBottom: '0.8rem',
  },
  preCumulatedCandidate: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.8rem',
  },
  preCumulatedText: {
    marginRight: '2rem',
  },
  otherText: {
    marginBottom: '0.5rem',
  },
}));

interface BallotListProps {
  ballot: ListBallot;
}

export function BallotList(props: BallotListProps) {
  const { ballot } = props;
  const { i18n, t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <div>
      <ul className={classes.list}>
        {ballot.personalVotesSameParty.map((personVote, index) => {
          const { candidate } = personVote;
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
                    <div className={classes.otherText}>
                      {ballot.chosenList.name[i18n.language]}
                    </div>
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
