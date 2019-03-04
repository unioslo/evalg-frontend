import React from 'react';
import { Trans } from 'react-i18next';

import { PageSection } from '../../../../../components/page';
import Icon from '../../../../../components/icon';
import {
  CandidateList,
  CandidateListItem,
  CandidateInfo,
} from './CandidateList';
import HelpSubSection from './HelpSubSection';
import MandatePeriodText from './MandatePeriodText';
import injectSheet from 'react-jss';
import BallotButtons from './BallotButtons';
import { ScreenSizeConsumer } from '../../../../../providers/ScreenSize';
import { Candidate, Election } from '../../../../../interfaces';

const helpTextTags = [
  'voter.majorityVoteHelpYouMaySelectOnlyOne',
  'voter.canVoteBlank',
];

interface IProps {
  candidates: Candidate[];
  selectedCandidateIndex: number;
  onSelectCandidate: (selectedCandidateIndex: number) => void;
  onDeselectCandidate: () => void;
  election: Election;
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
    onReviewBallot,
    onBlankVote,
    election,
    classes,
  } = props;
  const canSubmit = selectedCandidateIndex !== -1;

  return (
    <ScreenSizeConsumer>
      {({ screenSize }) => (
        <PageSection>
          <div className={classes.mandatePeriodTextDesktop}>
            <MandatePeriodText election={election} longDate />
          </div>
          <div className={classes.mandatePeriodTextMobile}>
            <MandatePeriodText election={election} />
          </div>
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
                        custom={
                          screenSize !== 'mobile' && screenSize !== 'sm'
                            ? { small: true }
                            : false
                        }
                        onClick={toggleSelectAction}
                      />
                    )}
                    <CandidateInfo candidate={candidate} infoUrl={true} />
                  </CandidateListItem>
                );
              })}
            </CandidateList>
            <BallotButtons
              canSubmit={canSubmit}
              onReviewBallot={onReviewBallot}
              onBlankVote={onBlankVote}
            />
          </HelpSubSection>
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

export default injectSheet(styles)(MajorityVoteBallot);
