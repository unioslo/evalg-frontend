import React from 'react';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';
import injectSheet from 'react-jss';

import Button, { ButtonContainer } from 'components/button';
import Icon from 'components/icon';
import { PageSection } from 'components/page';
import { ScreenSizeConsumer } from 'providers/ScreenSize';
import { Election, Candidate } from 'interfaces';
import Link from 'components/link';

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
import BallotButtons from './BallotButtons';

const helpTextTags = [
  'voter.prefElecNrOfCandidates',
  'voter.prefElecRankCandidates',
  'voter.prefElecOnlySelectedGetVote',
  'voter.canVoteBlank',
];

interface IProps extends WithTranslation {
  selectedCandidates: Candidate[];
  unselectedCandidates: Candidate[];
  election: Election;
  onAddCandidate: (c: Candidate) => void;
  onRemoveCandidate: (c: Candidate) => void;
  onMoveCandidate: (oldIndex: number, newIndex: number) => void;
  onResetBallot: () => void;
  onBlankVote: () => void;
  reviewBallotEnabled: boolean;
  onGoBackToSelectVoterGroup: () => void;
  onReviewBallot: () => void;
  classes: any;
}

interface IState {
  activeCandIndex: number;
}

class PrefElecBallot extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { activeCandIndex: -1 };
  }

  selectCandidate = (index: number) => {
    this.setState({ activeCandIndex: index });
  };

  deselectCandidate = () => {
    this.setState({ activeCandIndex: -1 });
  };

  promoteSelectedCandidate = () => {
    this.props.onMoveCandidate(
      this.state.activeCandIndex,
      this.state.activeCandIndex - 1
    );
    this.setState({ activeCandIndex: this.state.activeCandIndex - 1 });
  };

  demoteSelectedCandidate = () => {
    this.props.onMoveCandidate(
      this.state.activeCandIndex,
      this.state.activeCandIndex + 1
    );
    this.setState({ activeCandIndex: this.state.activeCandIndex + 1 });
  };

  removeCandidate = () => {
    const candidate = this.props.selectedCandidates[this.state.activeCandIndex];
    this.props.onRemoveCandidate(candidate);
    this.setState({ activeCandIndex: -1 });
  };

  public render() {
    const {
      selectedCandidates,
      unselectedCandidates,
      election,
      onAddCandidate,
      onRemoveCandidate,
      onMoveCandidate,
      onResetBallot,
      onBlankVote,
      reviewBallotEnabled,
      onGoBackToSelectVoterGroup,
      onReviewBallot,
      classes,
      t,
    } = this.props;

    const mobileResetButton = (
      <ScreenSizeConsumer>
        {({ screenSize }) =>
          (screenSize === 'mobile' || screenSize === 'sm') && (
            <ButtonContainer>
              <Button
                text={<Trans>voter.resetPrefElecBallot</Trans>}
                action={onResetBallot}
                disabled={selectedCandidates.length === 0}
                secondary
                fillWidth={screenSize === 'mobile'}
                centerContent={screenSize === 'mobile'}
              />
            </ButtonContainer>
          )
        }
      </ScreenSizeConsumer>
    );

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
              header={<Trans>voter.chooseCandidates</Trans>}
              desc={<Trans>voter.prefElecDesc</Trans>}
              helpTextTags={helpTextTags}
            />
            {mobileResetButton}
            <CandidateList>
              {selectedCandidates.map((c, index) => {
                let selectAction = this.selectCandidate.bind(this, index);
                if (this.state.activeCandIndex === index) {
                  selectAction = this.deselectCandidate;
                }
                const promoteCandidate = () =>
                  onMoveCandidate(index, index - 1);
                const demoteCandidate = () => onMoveCandidate(index, index + 1);
                const removeCandidate = () => onRemoveCandidate(c);

                return (
                  <CandidateListItem key={`selected-${index}`}>
                    <Icon
                      type="rankCircle"
                      custom={{
                        nr: index + 1,
                        small: screenSize !== 'mobile' && screenSize !== 'sm',
                      }}
                    />
                    <CandidateInfo candidate={c} infoUrl />
                    {screenSize === 'mobile' || screenSize === 'sm' ? (
                      <ToggleSelectIcon
                        flexRight
                        selected={index === this.state.activeCandIndex}
                        action={selectAction}
                      />
                    ) : (
                      <ListItemDesktopButtons>
                        {index !== 0 ? (
                          <UpArrow
                            onClick={promoteCandidate}
                            title={t('prefElec.ballot.promoteCandidate', {
                              candidate: c.name,
                              index: index,
                            })}
                          />
                        ) : null}
                        {index < selectedCandidates.length - 1 ? (
                          <DownArrow
                            onClick={demoteCandidate}
                            title={t('prefElec.ballot.demoteCandidate', {
                              candidate: c.name,
                              index: index + 2,
                            })}
                          />
                        ) : null}
                        <RemoveButton
                          onClick={removeCandidate}
                          title={t('prefElec.ballot.removeCandidate', {
                            candidate: c.name,
                          })}
                        />
                      </ListItemDesktopButtons>
                    )}
                  </CandidateListItem>
                );
              })}
              {unselectedCandidates.map((c, index) => (
                <CandidateListItem key={`unselected-${index}`}>
                  <Icon
                    type="addCircle"
                    title={t('prefElec.ballot.addCandidate', {
                      candidate: c.name,
                    })}
                    custom={
                      screenSize !== 'mobile' && screenSize !== 'sm'
                        ? 'small'
                        : false
                    }
                    onClick={onAddCandidate.bind(this, c)}
                  />
                  <CandidateInfo candidate={c} infoUrl />
                </CandidateListItem>
              ))}
            </CandidateList>

            {(screenSize === 'mobile' || screenSize === 'sm') &&
            this.state.activeCandIndex !== -1 ? (
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

export default withTranslation()(injectSheet(styles)(PrefElecBallot));
