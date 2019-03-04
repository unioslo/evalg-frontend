import * as React from 'react';
import { translate } from 'react-i18next';
import { TranslateHocProps } from 'react-i18next/src/translate';

import { Page } from '../../../../components/page';

import { shuffleArray } from '../../../../utils/helpers';
import MajorityVoteReview from './components/MajorityVoteReview';
import MajorityVoteBallot from './components/MajorityVoteBallot';
import { Candidate, Election } from '../../../../interfaces';

const dummySubmit = () => console.error('SUBMIT!');

interface IProps extends TranslateHocProps {
  election: Election;
  electionName: any;
}

interface IState {
  selectedCandidate: Candidate | null;
  selectedCandidateIndex: number;
  shuffledCandidates: Candidate[];
  isBlankVote: boolean;
  isReviewingBallot: boolean;
}

class MajorityVote extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedCandidate: null,
      selectedCandidateIndex: -1,
      shuffledCandidates: shuffleArray(props.election.lists[0].candidates),
      isBlankVote: false,
      isReviewingBallot: false,
    };
    this.handleSelectCandidate = this.handleSelectCandidate.bind(this);
    this.handleDeselectCandidate = this.handleDeselectCandidate.bind(this);
    this.handleReviewBallot = this.handleReviewBallot.bind(this);
    this.handleGoBackToBallot = this.handleGoBackToBallot.bind(this);
    this.handleBlankVote = this.handleBlankVote.bind(this);
  }
  public render() {
    const { i18n } = this.props;
    let lang = 'nb';
    if (i18n && i18n.language) {
      lang = i18n.language;
    }
    return (
      <Page header={this.props.electionName[lang]}>
        {this.state.isReviewingBallot ? (
          <MajorityVoteReview
            selectedCandidate={this.state.selectedCandidate}
            isBlankVote={this.state.isBlankVote}
            submitAction={dummySubmit}
            onGoBackToBallot={this.handleGoBackToBallot}
          />
        ) : (
          <MajorityVoteBallot
            candidates={this.state.shuffledCandidates}
            selectedCandidateIndex={this.state.selectedCandidateIndex}
            election={this.props.election}
            onSelectCandidate={this.handleSelectCandidate}
            onDeselectCandidate={this.handleDeselectCandidate}
            onBlankVote={this.handleBlankVote}
            onReviewBallot={this.handleReviewBallot}
          />
        )}
      </Page>
    );
  }

  private handleSelectCandidate(selectedCandidateIndex: number) {
    this.setState(currState => ({
      selectedCandidateIndex,
      selectedCandidate: currState.shuffledCandidates[selectedCandidateIndex],
    }));
  }
  private handleDeselectCandidate() {
    this.setState({ selectedCandidateIndex: -1 });
  }

  private handleReviewBallot() {
    this.setState({ isReviewingBallot: true });
  }

  private handleGoBackToBallot() {
    this.setState({
      isReviewingBallot: false,
      isBlankVote: false,
    });
  }

  private handleBlankVote() {
    this.setState({ isBlankVote: true }, this.handleReviewBallot);
  }
}

export default translate()(MajorityVote);
