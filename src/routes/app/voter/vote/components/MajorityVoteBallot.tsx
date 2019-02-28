import React from 'react';
import { Trans } from 'react-i18next';

import { Button, ButtonContainer } from '../../../../../components/button';
import Link from '../../../../../components/link';
import { PageSection } from '../../../../../components/page';
import { ScreenSizeConsumer } from '../../../../../providers/ScreenSize';
import {
  CandidateList,
  CandidateListItem,
  CandidateInfo,
  ToggleSelectIcon,
} from './CandidateList';
import HelpSubSection from './HelpSubSection';
import MandatePeriodText from './MandatePeriodText';
import injectSheet from 'react-jss';
import { Candidate, Election } from '../../../../../interfaces';

const helpTextTags = [
  'voter.majorityVoteHelpYouMaySelectOnlyOne',
  'voter.canVoteBlank',
];

interface IProps {
  candidates: Candidate[];
  selectedCandidateIndex: number;
  selectCandidate: (selectedCandidateIndex: number) => void;
  deselectCandidate: () => void;
  election: Election;
  toggleReviewAction: () => void;
  classes: any;
}

const MajorityVoteBallot: React.SFC<IProps> = props => {
  const {
    candidates,
    selectedCandidateIndex,
    selectCandidate,
    deselectCandidate,
    toggleReviewAction,
    election,
    classes,
  } = props;
  const canSubmit = selectedCandidateIndex !== -1;
  const ballotActions = (
    <ButtonContainer alignLeft={true}>
      <Link to="/voter" >
        <Button text={<Trans>general.back</Trans>} secondary={true} action={()=>null}/>
      </Link>
      <Button
        text={<Trans>election.showBallot</Trans>}
        disabled={!canSubmit}
        action={toggleReviewAction}
      />
    </ButtonContainer>
  );

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
            helpTextTags={helpTextTags}
          >
            {screenSize === 'sm' ? ballotActions : null}

            <CandidateList>
              {candidates.map((c, index) => {
                let selectAction = () => selectCandidate(index);
                if (selectedCandidateIndex === index) {
                  selectAction = deselectCandidate;
                }

                return (
                  <CandidateListItem key={index}>
                    <ToggleSelectIcon
                      selected={index === selectedCandidateIndex}
                      action={selectAction}
                      flexRight={false}
                    />
                    <CandidateInfo candidate={c} infoUrl={true} />
                  </CandidateListItem>
                );
              })}
            </CandidateList>
            {ballotActions}
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
