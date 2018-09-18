// import classNames from 'classnames';
import * as React from 'react';
import { Trans } from 'react-i18next';
import injectSheet from 'react-jss';

import { Button, ButtonContainer } from 'components/button';
import Icon from 'components/icon';
import Link from 'components/link';
import { PageSection } from 'components/page';
import CandidateButtonBar from 'routes/app/voter/vote/components/CandidateButtonBar';
import HelpSubSection from 'routes/app/voter/vote/components/HelpSubSection';
import MandatePeriodText from 'routes/app/voter/vote/components/MandatePeriodText';

// import Text from 'components/text';

const helpTextTags = [
  'voter.prefElecRankCandidatesShort',
  'voter.prefElecNrOfCandidates',
  'voter.prefElecOnlySelectedGetVote',
  'voter.canVoteBlank',
]

const styles = (theme: any) => ({
  candidateList: {
    marginTop: '2rem'
  },
  listItem: {
    alignItems: 'center',
    borderBottom: "1px solid #CCC",
    display: 'flex',
    padding: '0.6rem 0',
  },
  listItemSelect: {
    alignItems: 'flex-end',
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end'
  },
  listItemSubText: {
    fontSize: '1.2rem',
    paddingTop: '0.5rem'
  },
  listItemTextArea: {
    // alignItems: 'center',
    // display: 'flex',
    fontSize: '1.8rem',
    paddingLeft: '1rem',
  },
  rankIcon: {
    fill: theme.colors.darkTurquoise
  },
})

interface IProps {
  selectedCandidates: Candidate[]
  unselectedCandidates: Candidate[]
  moveCandidate: (oldIndex: number, newIndex: number) => void
  removeCandidate: (c: Candidate) => void,
  addCandidate: (c: Candidate) => void,
  election: Election,
  classes: any
  reviewAction: () => void
}

interface IState {
  activeCandIndex: number
}

class PrefElecMobile extends React.Component<IProps, IState> {
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
      selectedCandidates, unselectedCandidates, classes, election
    } = this.props;
    const canSubmit = selectedCandidates.length > 0
    const ballotActions =
      <ButtonContainer>
        <Link to="/voter">
          <Button
            text={<Trans>general.back</Trans>}
            secondary={true}
          />
        </Link>
        <Button
          text={<Trans>election.showBallot</Trans>}
          disabled={!canSubmit}
          action={this.props.reviewAction}
        />
      </ButtonContainer>
    return (
      <PageSection>
        <MandatePeriodText election={election} />
        <HelpSubSection
          header="Velg kandidater"
          helpTextTags={helpTextTags}>
          {ballotActions}
          <ul className={classes.candidateList}>
            {selectedCandidates.map((c, index) => {
              let selectAction = this.selectCandidate.bind(this, index)
              if (this.state.activeCandIndex === index) {
                selectAction = this.deselectCandidate
              }
              return (
                <SelectedCandidate
                  key={index}
                  active={index === this.state.activeCandIndex}
                  candidate={c}
                  classes={classes}
                  rankNr={index + 1}
                  selectAction={selectAction}
                />
              )
            })}
          </ul>
          <ul>
            {unselectedCandidates.map((c, index) => (
              <UnselectedCandidate
                key={index}
                candidate={c}
                classes={classes}
                addAction={this.props.addCandidate}
              />
            ))}
          </ul>
          {ballotActions}
          {this.state.activeCandIndex !== -1 ?
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
            /> : null
          }
        </HelpSubSection>

      </PageSection>
    )
  }

  private selectCandidate(index: number) {
    this.setState({ activeCandIndex: index });
  }

  private deselectCandidate() {
    this.setState({ activeCandIndex: -1 })
  }

  private promoteSelectedCandidate() {
    this.props.moveCandidate(
      this.state.activeCandIndex, this.state.activeCandIndex - 1
    );
    this.setState({ activeCandIndex: this.state.activeCandIndex - 1 })
  }

  private demoteSelectedCandidate() {
    this.props.moveCandidate(
      this.state.activeCandIndex,
      this.state.activeCandIndex + 1
    );
    this.setState({ activeCandIndex: this.state.activeCandIndex + 1 })
  }

  private removeCandidate() {
    const candidate = this.props.selectedCandidates[this.state.activeCandIndex];
    this.props.removeCandidate(candidate);
    this.setState({ activeCandIndex: -1 })
  }
}

interface ICandidateProps {
  candidate: Candidate
  addAction: (c: Candidate) => void
  classes: any
}

const UnselectedCandidate: React.SFC<ICandidateProps> = props => {
  const { classes } = props;
  const handleClick = () => props.addAction(props.candidate)
  return (
    <li className={classes.listItem}>
      <Icon type="addCircle" onClick={handleClick} />
      <div className={classes.listItemTextArea}>
        <div className={classes.listItemName}>
          {props.candidate.name}
        </div>
        <div className={classes.listItemSubText}>
          <Link to={props.candidate.informationUrl} external={true}>
            Mer om kandidaten
          </Link>
        </div>
      </div>
    </li>
  )
}

interface ISelectedCandProps {
  candidate: Candidate
  selectAction: () => void
  active: boolean,
  classes: any,
  rankNr: number
}

const SelectedCandidate: React.SFC<ISelectedCandProps> = props => {
  const { classes } = props;
  return (
    <li className={classes.listItem}>
      <svg width="42px" height="42px" viewBox="0 0 50 50">
        <g stroke="none" strokeWidth="1" fill="none">
          <circle className={classes.rankIcon} cx="25" cy="25" r="25" />
          <text x="50%" y="33px" fontSize="24" fontWeight="bold" fill="#FFF" textAnchor="middle">
            {props.rankNr}
          </text>
        </g>
      </svg>
      <div className={classes.listItemTextArea}>
        <div className={classes.listItemName}>
          {props.candidate.name}
        </div>
        <div className={classes.listItemSubText}>
          <Link to={props.candidate.informationUrl} external={true}>
            Mer om kandidaten
          </Link>
        </div>
      </div>
      <div onClick={props.selectAction} className={classes.listItemSelect}>
        {props.active ?
          <svg width="51px" height="46px" viewBox="0 0 51 62" version="1.1">
            <g stroke="none" strokeWidth="1" fill="none">
              <g id="Group">
                <rect fill="#D5EBEF" x="0" y="0" width="51" height="62" rx="8" />
                <g transform="translate(12.000000, 17.000000)">
                  <circle stroke="#8ECED9" strokeWidth="3" cx="14" cy="14" r="12.5" />
                  <circle fill="#2294A8" cx="14" cy="14" r="5" />
                </g>
              </g>
            </g>
          </svg> :
          <svg width="51px" height="46px" viewBox="0 0 51 62" version="1.1">
            <g stroke="none" strokeWidth="1" fill="none">
              <g id="Group">
                <rect fill="#F9F4FA" x="0" y="0" width="51" height="62" rx="8" />
                <g transform="translate(12.000000, 17.000000)">
                  <circle stroke="#8ECED9" strokeWidth="3" cx="14" cy="14" r="12.5" />

                </g>
              </g>
            </g>
          </svg>
        }
      </div>
    </li >
  )
}


export default injectSheet(styles)(PrefElecMobile);