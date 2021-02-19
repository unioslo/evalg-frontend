import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import { PageSection } from 'components/page';
import Icon from 'components/icon';
import { ScreenSizeConsumer } from 'providers/ScreenSize';
import { Candidate, Election } from 'interfaces';
import Link from 'components/link';

import {
  CandidateList,
  CandidateListItem,
  CandidateInfo,
} from './CandidateList';
import HelpSubSection from './HelpSubSection';
import MandatePeriodText from './MandatePeriodText';
import BallotButtons from './BallotButtons';

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
}));

interface IProps {
  alternatives: Candidate[];
  selectedAlternative: Candidate | null;
  onSelectAlternative: (candidate: Candidate) => void;
  onDeselectAlternative: () => void;
  election: Election;
  reviewBallotEnabled: boolean;
  onGoBackToSelectVoterGroup: () => void;
  onReviewBallot: () => void;
  onBlankVote: () => void;
}

const PollVoteBallot: React.FunctionComponent<IProps> = props => {
  const {
    alternatives,
    selectedAlternative,
    onSelectAlternative,
    onDeselectAlternative,
    reviewBallotEnabled,
    onGoBackToSelectVoterGroup,
    onReviewBallot,
    onBlankVote,
    election,
  } = props;

  const theme = useTheme();
  const classes = useStyles({ theme });
  const { t } = useTranslation();

  const showBlankButton =
    election.meta.ballotRules.allowBlank === undefined
      ? true
      : election.meta.ballotRules.allowBlank;

  const helpTextTags = ['pollElect.voteHelpYouMaySelectOnlyOne'];
  const helpHeader = t('pollElec.voteHelpHeader');
  const helpDesc = t('pollElec.voteHelpDesc');
  const helpText = [t('pollElec.voteHelpYouMaySelectOnlyOne')];

  if (showBlankButton) {
    helpTextTags.push('voter.canVoteBlank');
    helpText.push(t('voter.canVoteBlank'));
  }

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
            <CandidateList>
              {alternatives.map(alternative => {
                let toggleSelectAction = () => onSelectAlternative(alternative);
                if (selectedAlternative === alternative) {
                  toggleSelectAction = () => onDeselectAlternative();
                }

                return (
                  <CandidateListItem key={alternative.id}>
                    {selectedAlternative === alternative ? (
                      <Icon
                        type="radioButtonCircleSelected"
                        title={t('pollElec.ballot.removeChoice', {
                          alternative: alternative.name,
                        })}
                        custom={
                          screenSize !== 'mobile' && screenSize !== 'sm'
                            ? { small: true }
                            : false
                        }
                        onClick={toggleSelectAction}
                      />
                    ) : (
                      <Icon
                        type="radioButtonCircle"
                        title={t('pollElec.ballot.selectChoice', {
                          alternative: alternative.name,
                        })}
                        custom={
                          screenSize !== 'mobile' && screenSize !== 'sm'
                            ? { small: true }
                            : false
                        }
                        onClick={toggleSelectAction}
                      />
                    )}
                    <CandidateInfo candidate={alternative} infoUrl />
                  </CandidateListItem>
                );
              })}
            </CandidateList>
          </HelpSubSection>
          <BallotButtons
            onGoBackToSelectVoterGroup={onGoBackToSelectVoterGroup}
            onBlankVote={onBlankVote}
            showBlankVoteButton={showBlankButton}
            reviewBallotEnabled={reviewBallotEnabled}
            onReviewBallot={onReviewBallot}
          />
        </PageSection>
      )}
    </ScreenSizeConsumer>
  );
};

export default PollVoteBallot;
