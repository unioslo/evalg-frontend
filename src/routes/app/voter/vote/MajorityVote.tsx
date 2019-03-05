import * as React from 'react';
import { translate } from 'react-i18next';
import { TranslateHocProps } from 'react-i18next/src/translate';

import { shuffleArray } from '../../../../utils/helpers';
import { Page } from '../../../../components/page';
import MajorityVoteReview from './components/MajorityVoteReview';
import MajorityVoteBallot from './components/MajorityVoteBallot';
import { Candidate, Election, NameFields } from '../../../../interfaces';
import Receipt from './components/Receipt';
import VotingStepper, { VotingStep } from './components/VotingStepper';

interface IProps extends TranslateHocProps {
  election: Election;
  electionName: NameFields;
}

interface IState {
  selectedCandidate: Candidate | null;
  selectedCandidateIndex: number;
  shuffledCandidates: Candidate[];
  isBlankVote: boolean;
  currentStep: VotingStep;
}

class MajorityVote extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedCandidate: null,
      selectedCandidateIndex: -1,
      shuffledCandidates: shuffleArray(props.election.lists[0].candidates),
      isBlankVote: false,
      currentStep: VotingStep.Step1FillOutBallot,
    };
  }

  public render() {
    const { i18n } = this.props;
    let lang = 'nb';
    if (i18n && i18n.language) {
      lang = i18n.language;
    }
    const { currentStep } = this.state;
    const isCandidateSelected = this.state.selectedCandidateIndex !== -1;
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
            <MajorityVoteBallot
              candidates={this.state.shuffledCandidates}
              selectedCandidateIndex={this.state.selectedCandidateIndex}
              election={this.props.election}
              onSelectCandidate={this.handleSelectCandidate}
              onDeselectCandidate={this.handleDeselectCandidate}
              onBlankVote={this.handleBlankVote}
              reviewBallotEnabled={isCandidateSelected}
              onReviewBallot={this.handleReviewBallot}
            />
          )}
          {currentStep === VotingStep.Step2ReviewBallot && (
            <MajorityVoteReview
              selectedCandidate={this.state.selectedCandidate}
              isBlankVote={this.state.isBlankVote}
              submitAction={this.handleSubmitVote}
              onGoBackToBallot={this.handleGoBackToBallot}
            />
          )}
          {currentStep === VotingStep.Step3Receipt && <Receipt />}
        </Page>
      </>
    );
  }

  handleSelectCandidate = (selectedCandidateIndex: number) => {
    this.setState(currState => ({
      selectedCandidateIndex,
      selectedCandidate: currState.shuffledCandidates[selectedCandidateIndex],
    }));
  };

  handleDeselectCandidate = () => {
    this.setState({ selectedCandidateIndex: -1 });
  };

  handleReviewBallot = () => {
    this.setState({ currentStep: VotingStep.Step2ReviewBallot });
  };

  handleGoBackToBallot = () => {
    if (this.state.currentStep === VotingStep.Step2ReviewBallot) {
      this.setState({
        currentStep: VotingStep.Step1FillOutBallot,
        isBlankVote: false,
      });
    }
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

export default translate()(MajorityVote);
