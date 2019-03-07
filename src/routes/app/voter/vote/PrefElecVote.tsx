import * as React from 'react';
import { translate } from 'react-i18next';
import { TranslateHocProps } from 'react-i18next/src/translate';

import { shuffleArray } from '../../../../utils/helpers';
import { Page } from '../../../../components/page';
import PrefElecBallot from './components/PrefElecBallot';
import PrefElecReview from './components/PrefElecReview';
import { Election, Candidate, NameFields } from '../../../../interfaces';
import VotingStepper, { VotingStep } from './components/VotingStepper';
import Receipt from './components/Receipt';
import { withRouter, RouteComponentProps } from 'react-router';

function moveArrayItem(arr: any[], oldIndex: number, newIndex: number) {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
}

interface IProps extends TranslateHocProps {
  election: Election;
  electionName: NameFields;
}

interface IState {
  selectedCandidates: Candidate[];
  shuffledCandidates: Candidate[];
  isBlankVote: boolean;
  currentStep: VotingStep;
}

class PrefElecVote extends React.Component<
  IProps & RouteComponentProps,
  IState
> {
  scrollToDivRef: React.RefObject<HTMLDivElement>;

  constructor(props: IProps & RouteComponentProps) {
    super(props);
    this.state = {
      shuffledCandidates: shuffleArray(props.election.lists[0].candidates),
      selectedCandidates: [],
      isBlankVote: false,
      currentStep: VotingStep.Step2FillBallot,
    };
    this.scrollToDivRef = React.createRef();
  }

  componentDidMount() {
    this.scrollToTop();
  }

  public render() {
    const unselectedCandidates = this.state.shuffledCandidates.filter(
      c => this.state.selectedCandidates.indexOf(c) === -1
    );
    const { i18n } = this.props;
    let lang = 'nb';
    if (i18n && i18n.language) {
      lang = i18n.language;
    }
    const { currentStep } = this.state;
    const isCandidateSelected = this.state.selectedCandidates.length > 0;

    return (
      <>
        <VotingStepper
          currentStep={currentStep}
          onClickStep1={this.handleGoBackToSelectVoterGroup}
          onClickStep2={this.handleGoBackToBallot}
          scrollToDivRef={this.scrollToDivRef}
        />
        <Page header={this.props.electionName[lang]}>
          {currentStep === VotingStep.Step2FillBallot && (
            <PrefElecBallot
              selectedCandidates={this.state.selectedCandidates}
              unselectedCandidates={unselectedCandidates}
              election={this.props.election}
              onAddCandidate={this.handleAddCandidate}
              onRemoveCandidate={this.handleRemoveCandidate}
              onMoveCandidate={this.handleMoveCandidate}
              onResetBallot={this.handleResetBallot}
              onBlankVote={this.handleBlankVote}
              reviewBallotEnabled={isCandidateSelected}
              onGoBackToSelectVoterGroup={this.handleGoBackToSelectVoterGroup}
              onReviewBallot={this.handleReviewBallot}
            />
          )}
          {currentStep === VotingStep.Step3ReviewBallot && (
            <PrefElecReview
              selectedCandidates={this.state.selectedCandidates}
              isBlankVote={this.state.isBlankVote}
              onGoBackToBallot={this.handleGoBackToBallot}
              onSubmitVote={this.handleSubmitVote}
            />
          )}
          {currentStep === VotingStep.Step4Receipt && <Receipt />}
        </Page>
      </>
    );
  }

  scrollToTop = () => {
    if (this.scrollToDivRef.current) {
      this.scrollToDivRef.current.scrollIntoView();
    }
  };

  handleAddCandidate = (candidate: Candidate) => {
    this.setState(currState => ({
      selectedCandidates: currState.selectedCandidates.concat([candidate]),
    }));
  };

  handleRemoveCandidate = (candidate: Candidate) => {
    const selectedCandidates = this.state.selectedCandidates.filter(
      c => c !== candidate
    );
    this.setState({ selectedCandidates });
  };

  handleMoveCandidate = (oldIndex: number, newIndex: number) => {
    const emptyArray: Candidate[] = [];
    const arrayCopy: Candidate[] = emptyArray.concat(
      this.state.selectedCandidates
    );
    moveArrayItem(arrayCopy, oldIndex, newIndex);
    this.setState({ selectedCandidates: arrayCopy });
  };

  handleResetBallot = () => {
    this.setState({ selectedCandidates: [] });
  };

  handleReviewBallot = () => {
    this.scrollToTop();
    this.setState({ currentStep: VotingStep.Step3ReviewBallot });
  };

  handleGoBackToBallot = () => {
    this.scrollToTop();
    this.setState({
      currentStep: VotingStep.Step2FillBallot,
      isBlankVote: false,
    });
  };

  handleBlankVote = () => {
    this.setState(
      { isBlankVote: true, selectedCandidates: [] },
      this.handleReviewBallot
    );
  };

  handleGoBackToSelectVoterGroup = () => {
    if (this.props.election.electionGroup) {
      this.props.history.push(
        `/voter/election-groups/${
          this.props.election.electionGroup.id
        }/select-voting-group`
      );
    }
  };

  handleSubmitVote = () => {
    this.scrollToTop();
    // TODO
    console.log('Submitting vote...');
    this.setState({ currentStep: VotingStep.Step4Receipt });
  };
}

const hm = withRouter(PrefElecVote);
export default translate()(hm);
