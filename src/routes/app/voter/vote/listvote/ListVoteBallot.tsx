import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import { PageSection } from 'components/page';
import Icon from 'components/icon';
import { ScreenSizeConsumer } from 'providers/ScreenSize';
import { Election, ElectionList } from 'interfaces';
import Link from 'components/link';
import {
  StatelessExpandableSubSection,
  PageExpandableSubSection,
} from 'components/page/PageSection';

import ListBallotButtons from './ListBallotButtons';

import {
  CandidateList,
  ElectionListList,
  ElectionListItem,
} from './ElectionListList';

import HelpSubSection from '../components/HelpSubSection';
import MandatePeriodText from '../components/MandatePeriodText';
import BallotButtons from '../components/BallotButtons';

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
  onGoBackToSelectVoterGroup: () => void;
  onBlankVote: () => void;
  onCleanVote: (list: ElectionList) => void;
  onEditVote: (list: ElectionList) => void;
}

export default function ListVoteBallot(props: ListVoteBallotProps) {
  const {
    election,
    lists,
    onGoBackToSelectVoterGroup,
    onBlankVote,
    onCleanVote,
    onEditVote,
  } = props;

  const { i18n, t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });
  const [expandedList, setExpandedList] = useState<string>('');

  const helpTextTags = [
    'voter.majorityVoteHelpYouMaySelectOnlyOne',
    'voter.canVoteBlank',
  ];

  let helpText: string[] | undefined;
  let helpHeader = t('voter.listVoteHelpHeader');
  let helpDesc = t('voter.listVoteHelpDesc');

  // TODO sjekk a11y på knapper osv. Labels

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
            helpText={helpText}
          >
            <ElectionListList>
              {lists.map((list) => {
                return (
                  <ElectionListItem key={list.id}>
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
                              <CandidateList
                                noHeader
                                candidates={list.candidates}
                              />
                            </PageExpandableSubSection>
                            <ListBallotButtons
                              onEditList={() => onEditVote(list)}
                              onReviewBallot={() => onCleanVote(list)}
                            />
                          </>
                        ) : (
                          <CandidateList candidates={list.candidates} />
                        )}
                      </div>
                    </StatelessExpandableSubSection>
                  </ElectionListItem>
                );
              })}
            </ElectionListList>
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
