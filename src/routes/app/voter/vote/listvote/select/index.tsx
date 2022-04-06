import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import Link from 'components/link';
import { PageSection } from 'components/page';
import {
  StatelessExpandableSubSection,
  PageExpandableSubSection,
} from 'components/page/PageSection';
import { Election, ElectionList } from 'interfaces';
import { ScreenSizeConsumer } from 'providers/ScreenSize';

import ListBallotButtons from './ListBallotButtons';
import HelpSubSection from '../../components/HelpSubSection';
import MandatePeriodText from '../../components/MandatePeriodText';
import BallotButtons from '../../components/BallotButtons';
import ListCandidateItem from '../listCandidateItem/Item';

const useStyles = createUseStyles((theme: any) => ({
  mandatePeriodTextDesktop: {
    display: 'none',
    [theme.breakpoints.mdQuery]: {
      display: 'inherit',
      ...theme.ingress,
    },
  },
  mandatePeriodTextMobile: {
    [theme.breakpoints.mdQuery]: {
      display: 'none',
    },
  },
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
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '3rem',
  },

  listHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    [theme.breakpoints.mdQuery]: {
      flexDirection: 'row',
    },
  },

  descriptionContainer: {
    width: '90%',
    [theme.breakpoints.mdQuery]: {
      width: '50%',
    },
    display: 'flex',
    flexDirection: 'column',
  },
  listDescription: {
    textAlign: 'justify',
    marginBottom: '2rem',
  },
  listMoreInfoLink: {
    marginBottom: '2rem',
  },
}));

interface ListVoteBallotProps {
  lists: ElectionList[];
  election: Election;
  expandedList: string;
  onGoBackToSelectVoterGroup: () => void;
  onBlankVote: () => void;
  onCleanVote: (list: ElectionList) => void;
  onEditVote: (list: ElectionList) => void;
  setExpandedList: (list: string) => void;
}

export default function SelectElectionList(props: ListVoteBallotProps) {
  const {
    election,
    expandedList,
    lists,
    onGoBackToSelectVoterGroup,
    onBlankVote,
    onCleanVote,
    onEditVote,
    setExpandedList,
  } = props;

  const { i18n, t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const helpTextTags = [
    t('voter.listVote.helpTextTags.choseList'),
    t('voter.listVote.helpTextTags.noEdits'),
    t('voter.listVote.helpTextTags.edits'),
    t('voter.canVoteBlank'),
  ];

  let helpHeader = t('voter.listVoteHelpHeader');
  let helpDesc = t('voter.listVoteHelpDesc');

  return (
    <ScreenSizeConsumer>
      {({ screenSize }) => (
        <PageSection noBorder>
          <div className={classes.mandatePeriodTextDesktop}>
            <MandatePeriodText election={election} longDate />
          </div>
          <div className={classes.mandatePeriodTextMobile}>
            <MandatePeriodText election={election} />
          </div>
          {election.informationUrl && (
            <p>
              {t('voterGroupSelect.moreAboutTheElection')}:{' '}
              <Link to={election.informationUrl} external>
                {election.informationUrl}
              </Link>
            </p>
          )}
          <HelpSubSection
            header={helpHeader}
            desc={helpDesc}
            helpTextTags={helpTextTags}
          >
            <ul className={classes.list}>
              {lists.map((list) => {
                // The candidates in a list are not sorted by priority
                const listCandidatesSorted = [...list.candidates].sort(
                  (a, b) => a.priority - b.priority
                );

                return (
                  <li className={classes.listItem} key={list.id}>
                    <StatelessExpandableSubSection
                      noMargin
                      header={list.name[i18n.language]}
                      isExpanded={expandedList === list.id}
                      setIsExpanded={() =>
                        expandedList === list.id
                          ? setExpandedList('')
                          : setExpandedList(list.id)
                      }
                    >
                      <div className={classes.listContainer}>
                        <div className={classes.listHeaderContainer}>
                          <div className={classes.descriptionContainer}>
                            <div className={classes.listDescription}>
                              <p>{list.description[i18n.language]}</p>
                            </div>
                            <div className={classes.listMoreInfoLink}>
                              {list.informationUrl && (
                                <Link external to={list.informationUrl}>
                                  {t('voter.listVote.moreInfo', {
                                    list: list.name[i18n.language],
                                  })}
                                </Link>
                              )}
                            </div>
                          </div>
                          <div>
                            {screenSize !== 'mobile' && screenSize !== 'sm' && (
                              <ListBallotButtons
                                onEditList={() => onEditVote(list)}
                                onReviewBallot={() => onCleanVote(list)}
                              />
                            )}
                          </div>
                        </div>
                        {['mobile', 'sm'].includes(screenSize) ? (
                          <>
                            <PageExpandableSubSection
                              header={t('voter.listVote.candidates')}
                            >
                              <ul className={classes.list}>
                                {listCandidatesSorted.map(
                                  (candidate, index) => {
                                    return (
                                      <ListCandidateItem
                                        candidate={candidate}
                                        priority={index}
                                        key={candidate.id}
                                      />
                                    );
                                  }
                                )}
                              </ul>
                            </PageExpandableSubSection>
                            <ListBallotButtons
                              onEditList={() => onEditVote(list)}
                              onReviewBallot={() => onCleanVote(list)}
                            />
                          </>
                        ) : (
                          <ul className={classes.list}>
                            {listCandidatesSorted.map((candidate, index) => {
                              return (
                                <ListCandidateItem
                                  candidate={candidate}
                                  priority={index}
                                  key={candidate.id}
                                />
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </StatelessExpandableSubSection>
                  </li>
                );
              })}
            </ul>
          </HelpSubSection>
          <BallotButtons
            onGoBackToSelectVoterGroup={onGoBackToSelectVoterGroup}
            onBlankVote={onBlankVote}
            reviewBallotEnabled={false}
            onReviewBallot={() => {}}
            showVoteButton={false}
          />
        </PageSection>
      )}
    </ScreenSizeConsumer>
  );
}
