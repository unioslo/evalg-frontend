// import classNames from 'classnames';
import * as React from 'react';
import { Trans } from 'react-i18next';

import { Button, ButtonContainer } from '../../../../../components/button';
import Icon from '../../../../../components/icon';
import Link from '../../../../../components/link';
import { PageSection } from '../../../../../components/page';
import { ScreenSizeConsumer } from '../../../../../providers/ScreenSize';
import CandidateButtonBar from './CandidateButtonBar';
import {
  CandidateInfo,
  CandidateList,
  CandidateListItem,
  DownArrow,
  ListItemDesktopButtons,
  RemoveButton,
  ToggleSelectIcon,
  UpArrow,
} from './CandidateList';
import HelpSubSection from './HelpSubSection';
import MandatePeriodText from './MandatePeriodText';
import injectSheet from 'react-jss';

const helpTextTags = [
  'voter.prefElecRankCandidatesShort',
  'voter.prefElecNrOfCandidates',
  'voter.prefElecOnlySelectedGetVote',
  'voter.canVoteBlank',
];
import { Election, Candidate } from '../../../../../interfaces';


interface IProps {
  selectedCandidates: Candidate[];
  unselectedCandidates: Candidate[];
  moveCandidate: (oldIndex: number, newIndex: number) => void;
  removeCandidate: (c: Candidate) => void;
  addCandidate: (c: Candidate) => void;
  election: Election;
  reviewAction: () => void;
  classes: any;
}

interface IState {
  activeCandIndex: number;
}

class PrefElecBallot extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { activeCandIndex: -1 };
    this.promoteSelectedCandidate = this.promoteSelectedCandidate.bind(this);
    this.demoteSelectedCandidate = this.demoteSelectedCandidate.bind(this);
    this.selectCandidate = this.selectCandidate.bind(this);
    this.deselectCandidate = this.deselectCandidate.bind(this);
    this.removeCandidate = this.removeCandidate.bind(this);
  }

  public render() {
    const {
      selectedCandidates,
      unselectedCandidates,
      election,
      classes,
    } = this.props;
    const canSubmit = selectedCandidates.length > 0;

    const ballotActions = (
      <ButtonContainer alignLeft={true}>
        <Link to="/voter">
          <Button text={<Trans>general.back</Trans>} secondary={true} action={() => null}/>
        </Link>
        <Button
          text={<Trans>election.showBallot</Trans>}
          disabled={!canSubmit}
          action={this.props.reviewAction}
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
              header={<Trans>voter.chooseCandidates</Trans>}
              desc={<Trans>voter.prefElecDesc</Trans>}
              helpTextTags={helpTextTags}
            >
              {screenSize === 'sm' ? ballotActions : null}

              <CandidateList>
                {selectedCandidates.map((c, index) => {
                  let selectAction = this.selectCandidate.bind(this, index);
                  if (this.state.activeCandIndex === index) {
                    selectAction = this.deselectCandidate;
                  }
                  const promoteCandidate = () =>
                    this.props.moveCandidate(index, index - 1);
                  const demoteCandidate = () =>
                    this.props.moveCandidate(index, index + 1);
                  const removeCandidate = () => this.props.removeCandidate(c);
                  return (
                    <CandidateListItem key={`selected-${index}`}>
                      <Icon
                        type="rankCircle"
                        custom={{
                          nr: index + 1,
                          small: screenSize !== 'sm',
                        }}
                      />
                      <CandidateInfo candidate={c} infoUrl={true} />
                      {screenSize === 'sm' ? (
                        <ToggleSelectIcon
                          flexRight
                          selected={index === this.state.activeCandIndex}
                          action={selectAction}
                        />
                      ) : (
                        <ListItemDesktopButtons>
                          {index !== 0 ? (
                            <UpArrow onClick={promoteCandidate} />
                          ) : null}
                          {index < selectedCandidates.length - 1 ? (
                            <DownArrow onClick={demoteCandidate} />
                          ) : null}
                          <RemoveButton onClick={removeCandidate} />
                        </ListItemDesktopButtons>
                      )}
                    </CandidateListItem>
                  );
                })}
                {unselectedCandidates.map((c, index) => (
                  <CandidateListItem key={`unselected-${index}`}>
                    <Icon
                      type="addCircle"
                      custom={screenSize !== 'sm' ? 'small' : false}
                      onClick={this.props.addCandidate.bind(this, c)}
                    />
                    <CandidateInfo candidate={c} infoUrl={true} />
                  </CandidateListItem>
                ))}
              </CandidateList>
              {ballotActions}

              {screenSize === 'sm' && this.state.activeCandIndex !== -1 ? (
                <CandidateButtonBar
                  upAction={this.promoteSelectedCandidate}
                  downAction={this.demoteSelectedCandidate}
                  removeAction={this.removeCandidate}
                  removeText={<Trans>general.remove</Trans>}
                  upDisabled={this.state.activeCandIndex === 0}
                  downDisabled={
                    this.state.activeCandIndex ===
                    this.props.selectedCandidates.length - 1
                  }
                />
              ) : null}
            </HelpSubSection>
          </PageSection>
        )}
      </ScreenSizeConsumer>
    );
  }

  private selectCandidate(index: number) {
    this.setState({ activeCandIndex: index });
  }

  private deselectCandidate() {
    this.setState({ activeCandIndex: -1 });
  }

  private promoteSelectedCandidate() {
    this.props.moveCandidate(
      this.state.activeCandIndex,
      this.state.activeCandIndex - 1
    );
    this.setState({ activeCandIndex: this.state.activeCandIndex - 1 });
  }

  private demoteSelectedCandidate() {
    this.props.moveCandidate(
      this.state.activeCandIndex,
      this.state.activeCandIndex + 1
    );
    this.setState({ activeCandIndex: this.state.activeCandIndex + 1 });
  }

  private removeCandidate() {
    const candidate = this.props.selectedCandidates[this.state.activeCandIndex];
    this.props.removeCandidate(candidate);
    this.setState({ activeCandIndex: -1 });
  }
}

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

export default injectSheet(styles)(PrefElecBallot);
