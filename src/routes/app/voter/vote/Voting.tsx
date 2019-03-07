import * as React from 'react';
import { translate } from 'react-i18next';
import { TranslateHocProps } from 'react-i18next/src/translate';

import { shuffleArray } from '../../../../utils/helpers';
import { Page } from '../../../../components/page';
import { Candidate, Election, NameFields } from '../../../../interfaces';
import Receipt from './components/Receipt';
import VotingStepper, { VotingStep } from './components/VotingStepper';

interface IProps extends TranslateHocProps {
  fillBallotComponent: React.ComponentType;
  reviewBallotComponent: React.ComponentType;
  election: Election;
  electionName: NameFields;
}

interface IState {
  shuffledCandidates: Candidate[];
  isBlankVote: boolean;
  currentStep: VotingStep;
}

class Voting extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      shuffledCandidates: shuffleArray(props.election.lists[0].candidates),
      isBlankVote: false,
      currentStep: VotingStep.Step2FillBallot,
    };
  }

  public render() {
    const { fillBallotComponent, reviewBallotComponent, i18n } = this.props;
    let lang = 'nb';
    if (i18n && i18n.language) {
      lang = i18n.language;
    }
    const { currentStep } = this.state;

    return (
      <>
        <VotingStepper
          currentStep={currentStep}
          onClickStep1={this.handleGoBackToSelectVoterGroup}
          onClickStep2={this.handleGoBackToBallot}
        />
        <Page header={this.props.electionName[lang]}>
          {currentStep === VotingStep.Step2FillBallot && fillBallotComponent}
          {currentStep === VotingStep.Step3ReviewBallot &&
            reviewBallotComponent}
          {currentStep === VotingStep.Step4Receipt && <Receipt />}
        </Page>
      </>
    );
  }

  handleReviewBallot = () => {
    this.setState({ currentStep: VotingStep.Step3ReviewBallot });
  };

  handleGoBackToBallot = () => {
    if (this.state.currentStep === VotingStep.Step3ReviewBallot) {
      this.setState({
        currentStep: VotingStep.Step2FillBallot,
        isBlankVote: false,
      });
    }
  };

  handleBlankVote = () => {
    this.setState({ isBlankVote: true }, this.handleReviewBallot);
  };

  handleGoBackToSelectVoterGroup = () => {};

  handleSubmitVote = () => {
    // TODO
    console.log('Submitting vote...');
    this.setState({ currentStep: VotingStep.Step4Receipt });
  };
}

export default translate()(Voting);
