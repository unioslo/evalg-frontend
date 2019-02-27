import React from 'react';
import { Trans } from 'react-i18next';

import { Button, ButtonContainer } from 'components/button';
import Link from 'components/link';
import { PageSection } from 'components/page';
import { ScreenSizeConsumer } from 'providers/ScreenSize';
import {
  CandidateList,
  CandidateListItem,
  CandidateInfo,
  ToggleSelectIcon,
} from './CandidateList';
import HelpSubSection from './HelpSubSection';
import MandatePeriodText from './MandatePeriodText';
import injectSheet from 'react-jss';

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
  const ballotActions = (
    <ScreenSizeConsumer>
      {({ screenSize }) =>
        screenSize === 'sm' ? (
          <>
            <ButtonContainer>
              <Link to="/voter">
                <Button text={<Trans>general.back</Trans>} secondary />
              </Link>
              <Button
                text={<Trans>election.showBallot</Trans>}
                disabled={!canSubmit}
                action={onReviewBallot}
              />
            </ButtonContainer>
            <ButtonContainer>
              <Button
                text={<Trans>election.blankVote</Trans>}
                action={onBlankVote}
                secondary
                fillWidth
                centerContent
              />
            </ButtonContainer>
          </>
        ) : (
          <ButtonContainer alignLeft>
            <Link to="/voter">
              <Button text={<Trans>general.back</Trans>} secondary />
            </Link>
            <Button
              text={<Trans>election.blankVote</Trans>}
              action={onBlankVote}
              secondary
            />
            <Button
              text={<Trans>election.showBallot</Trans>}
              disabled={!canSubmit}
              action={onReviewBallot}
            />
          </ButtonContainer>
        )
      }
    </ScreenSizeConsumer>
  );

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
        {ballotActions}
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
