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
import { withRouter, RouteComponentProps } from 'react-router';

interface IProps extends TranslateHocProps {
  election: Election;
  electionName: NameFields;
}

interface IState {
  shuffledCandidates: Candidate[];
  selectedCandidateIndex: number;
  selectedCandidate: Candidate | null;
  isBlankVote: boolean;
  currentStep: VotingStep;
}

class MajorityVote extends React.Component<
  IProps & RouteComponentProps,
  IState
> {
  scrollToDivRef: React.RefObject<HTMLDivElement>;

  constructor(props: IProps & RouteComponentProps) {
    super(props);
    this.state = {
      shuffledCandidates: shuffleArray(props.election.lists[0].candidates),
      selectedCandidateIndex: -1,
      selectedCandidate: null,
      isBlankVote: false,
      currentStep: VotingStep.Step2FillBallot,
    };
    this.scrollToDivRef = React.createRef();
  }

  componentDidMount() {
    this.scrollToTop();
  }

  public render() {
    const { i18n } = this.props;
    let lang = 'nb';
    if (i18n && i18n.language) {
      lang = i18n.language;
    }
    const { currentStep } = this.state;
    const isCandidateSelected = this.state.selectedCandidateIndex !== -1;

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
            <MajorityVoteBallot
              candidates={this.state.shuffledCandidates}
              selectedCandidateIndex={this.state.selectedCandidateIndex}
              election={this.props.election}
              onSelectCandidate={this.handleSelectCandidate}
              onDeselectCandidate={this.handleDeselectCandidate}
              onBlankVote={this.handleBlankVote}
              reviewBallotEnabled={isCandidateSelected}
              onGoBackToSelectVoterGroup={this.handleGoBackToSelectVoterGroup}
              onReviewBallot={this.handleReviewBallot}
            />
          )}
          {currentStep === VotingStep.Step3ReviewBallot && (
            <MajorityVoteReview
              selectedCandidate={this.state.selectedCandidate}
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
    this.setState(
      { isBlankVote: true, selectedCandidateIndex: -1 },
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
    // TODO
    console.log('Submitting vote...');
    this.setState({ currentStep: VotingStep.Step4Receipt });
  };
}

export default translate()(withRouter(MajorityVote));
