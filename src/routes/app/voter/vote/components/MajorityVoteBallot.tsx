import React from 'react';
import { Trans, withTranslation, WithTranslation} from 'react-i18next';
import injectSheet from 'react-jss';

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

const helpTextTags = [
  'voter.majorityVoteHelpYouMaySelectOnlyOne',
  'voter.canVoteBlank',
];

interface IProps extends WithTranslation {
  candidates: Candidate[];
  selectedCandidateIndex: number;
  onSelectCandidate: (selectedCandidateIndex: number) => void;
  onDeselectCandidate: () => void;
  election: Election;
  reviewBallotEnabled: boolean;
  onGoBackToSelectVoterGroup: () => void;
  onReviewBallot: () => void;
  onBlankVote: () => void;
  classes: any;
}

const MajorityVoteBallot: React.SFC<IProps> = props => {
  const {
    candidates,
    selectedCandidateIndex,
    onSelectCandidate,
    onDeselectCandidate,
    reviewBallotEnabled,
    onGoBackToSelectVoterGroup,
    onReviewBallot,
    onBlankVote,
    election,
    classes,
    t,
  } = props;

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
              <Trans>voterGroupSelect.moreAboutTheElection</Trans>:{' '}
              <Link to={election.informationUrl} external>
                {election.informationUrl}
              </Link>
            </p>
          )}
          <HelpSubSection
            header={<Trans>voter.majorityVoteHelpHeader</Trans>}
            desc={<Trans>voter.majorityVoteHelpDesc</Trans>}
            helpTextTags={helpTextTags}
          >
            <CandidateList>
              {candidates.map((candidate, index) => {
                let toggleSelectAction = () => onSelectCandidate(index);
                if (selectedCandidateIndex === index) {
                  toggleSelectAction = onDeselectCandidate;
                }

                return (
                  <CandidateListItem key={index}>
                    {index === selectedCandidateIndex ? (
                      <Icon
                        type="radioButtonCircleSelected"
                        title={t('majorityElec.ballot.removeCandidate', {candidate: candidate.name})}
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
                        title={t('majorityElec.ballot.chooseCandidate', {candidate: candidate.name})}
                        custom={
                          screenSize !== 'mobile' && screenSize !== 'sm'
                            ? { small: true }
                            : false
                        }
                        onClick={toggleSelectAction}
                      />
                    )}
                    <CandidateInfo candidate={candidate} infoUrl/>
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

const styles = (theme: any) => ({
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
});

export default withTranslation()(injectSheet(styles)(MajorityVoteBallot));
