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

class PrefElecVote extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      shuffledCandidates: shuffleArray(props.election.lists[0].candidates),
      selectedCandidates: [],
      isBlankVote: false,
      currentStep: VotingStep.Step1FillOutBallot,
    };
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
    const isStepperStep1Clickable =
      this.state.currentStep === VotingStep.Step1FillOutBallot ||
      this.state.currentStep === VotingStep.Step2ReviewBallot;

    return (
      <>
        <VotingStepper
          currentStep={currentStep}
          isStep1Clickable={isStepperStep1Clickable}
          onClickStep1={this.handleGoBackToBallot}
        />
        <Page header={this.props.electionName[lang]}>
          {currentStep === VotingStep.Step1FillOutBallot && (
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
              onReviewBallot={this.handleReviewBallot}
            />
          )}
          {currentStep === VotingStep.Step2ReviewBallot && (
            <PrefElecReview
              selectedCandidates={this.state.selectedCandidates}
              isBlankVote={this.state.isBlankVote}
              onGoBackToBallot={this.handleGoBackToBallot}
              onSubmitVote={this.handleSubmitVote}
            />
          )}
          {currentStep === VotingStep.Step3Receipt && <Receipt />}
        </Page>
      </>
    );
  }

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
    this.setState({ currentStep: VotingStep.Step2ReviewBallot });
  };

  handleGoBackToBallot = () => {
    this.setState({
      currentStep: VotingStep.Step1FillOutBallot,
      isBlankVote: false,
    });
  };

  handleBlankVote = () => {
    this.setState({ isBlankVote: true }, this.handleReviewBallot);
  };

  handleSubmitVote = () => {
    // TODO
    console.log('Submitting vote...');
    this.setState({ currentStep: VotingStep.Step3Receipt });
  };
}

export default translate()(PrefElecVote);
