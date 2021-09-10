import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import { PageSection } from 'components/page';
import Icon from 'components/icon';
import { ScreenSizeConsumer } from 'providers/ScreenSize';
import { Candidate, Election } from 'interfaces';
import Link from 'components/link';
import Alert from 'components/alerts';

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
  candidates: Candidate[];
  selectedCandidates: Candidate[];
  errorMsg?: string;
  onSelectCandidate: (candidate: Candidate) => void;
  onDeselectCandidate: (candidate: Candidate) => void;
  election: Election;
  reviewBallotEnabled: boolean;
  onGoBackToSelectVoterGroup: () => void;
  onReviewBallot: () => void;
  onBlankVote: () => void;
}

const MajorityVoteBallot: React.FunctionComponent<IProps> = (props) => {
  const {
    candidates,
    selectedCandidates,
    errorMsg,
    onSelectCandidate,
    onDeselectCandidate,
    reviewBallotEnabled,
    onGoBackToSelectVoterGroup,
    onReviewBallot,
    onBlankVote,
    election,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const helpTextTags = [
    'voter.majorityVoteHelpYouMaySelectOnlyOne',
    'voter.canVoteBlank',
  ];

  let helpText: string[] | undefined;
  let helpHeader = t('voter.majorityVoteHelpHeader');
  let helpDesc = t('voter.majorityVoteHelpDesc');
  const votesRules = election.meta.ballotRules.votes;

  if (votesRules === 'nr_of_seats') {
    helpHeader = t('voter.majorityVoteHelpHeaderMultiple', {
      nr: election.meta.candidateRules.seats,
    });

    helpDesc = t('voter.majorityVoteHelpDescMultiple');

    helpText = [
      t('voter.majorityVoteHelpYouMaySelectMultiple', {
        nr: votesRules,
      }),
      t('voter.canVoteBlank'),
    ];
  } else if (typeof votesRules === 'number') {
    helpHeader = t('voter.majorityVoteHelpHeaderMultiple', {
      nr: votesRules,
    });

    helpDesc = t('voter.majorityVoteHelpDescMultiple');

    helpText = [
      t('voter.majorityVoteHelpYouMaySelectMultiple', {
        nr: votesRules,
      }),
      t('voter.canVoteBlank'),
    ];
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
            {errorMsg && <Alert type="error">{errorMsg}</Alert>}
            <CandidateList>
              {candidates.map((candidate) => {
                let toggleSelectAction = () => onSelectCandidate(candidate);
                if (selectedCandidates.includes(candidate)) {
                  toggleSelectAction = () => onDeselectCandidate(candidate);
                }

                return (
                  <CandidateListItem key={candidate.id}>
                    {selectedCandidates.includes(candidate) ? (
                      <Icon
                        type="radioButtonCircleSelected"
                        title={t('majorityElec.ballot.removeCandidate', {
                          candidate: candidate.name,
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
                        title={t('majorityElec.ballot.chooseCandidate', {
                          candidate: candidate.name,
                        })}
                        custom={
                          screenSize !== 'mobile' && screenSize !== 'sm'
                            ? { small: true }
                            : false
                        }
                        onClick={toggleSelectAction}
                      />
                    )}
                    <CandidateInfo candidate={candidate} infoUrl />
                  </CandidateListItem>
                );
              })}
            </CandidateList>
          </HelpSubSection>
          <BallotButtons
            onGoBackToSelectVoterGroup={onGoBackToSelectVoterGroup}
            onBlankVote={onBlankVote}
            reviewBallotEnabled={reviewBallotEnabled}
            onReviewBallot={onReviewBallot}
          />
        </PageSection>
      )}
    </ScreenSizeConsumer>
  );
};

export default MajorityVoteBallot;
