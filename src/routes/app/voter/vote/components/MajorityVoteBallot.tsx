import React from 'react';
import { Trans } from 'react-i18next';

import { PageSection } from 'components/page';
import {
  CandidateList,
  CandidateListItem,
  CandidateInfo,
  ToggleSelectIcon,
} from './CandidateList';
import HelpSubSection from './HelpSubSection';
import MandatePeriodText from './MandatePeriodText';
import injectSheet from 'react-jss';
import BallotButtons from './BallotButtons';

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
    <PageSection>
      <div className={classes.mandatePeriodTextDesktop}>
        <MandatePeriodText election={election} longDate />
      </div>
      <div className={classes.mandatePeriodTextMobile}>
        <MandatePeriodText election={election} />
      </div>
      <HelpSubSection
        header={<Trans>voter.majorityVoteHelpHeader</Trans>}
        helpTextTags={helpTextTags}
      >
        <CandidateList>
          {candidates.map((c, index) => {
            let selectAction = () => onSelectCandidate(index);
            if (selectedCandidateIndex === index) {
              selectAction = onDeselectCandidate;
            }

            return (
              <CandidateListItem key={index}>
                <ToggleSelectIcon
                  selected={index === selectedCandidateIndex}
                  action={selectAction}
                />
                <CandidateInfo candidate={c} infoUrl={true} />
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
