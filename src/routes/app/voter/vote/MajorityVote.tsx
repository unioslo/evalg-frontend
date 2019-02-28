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
  reviewingBallot: boolean;
}

class MajorityVote extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      reviewingBallot: false,
      selectedCandidate: null,
      selectedCandidateIndex: -1,
      shuffledCandidates: shuffleArray(props.election.lists[0].candidates),
    };
    this.selectCandidate = this.selectCandidate.bind(this);
    this.deselectCandidate = this.deselectCandidate.bind(this);
    this.toggleShowBallotReview = this.toggleShowBallotReview.bind(this);
  }
  public render() {
    const { i18n } = this.props;
    let lang = 'nb';
    if (i18n && i18n.language) {
      lang = i18n.language;
    }
    return (
      <Page header={this.props.electionName[lang]}>
        {this.state.reviewingBallot && this.state.selectedCandidate ? (
          <MajorityVoteReview
            backAction={this.toggleShowBallotReview}
            selectedCandidate={this.state.selectedCandidate}
            submitAction={dummySubmit}
            toggleReviewAction={this.toggleShowBallotReview}
            // FIX ME!
            blankVote={false}
          />
        ) : (
          <MajorityVoteBallot
            candidates={this.state.shuffledCandidates}
            selectedCandidateIndex={this.state.selectedCandidateIndex}
            selectCandidate={this.selectCandidate}
            deselectCandidate={this.deselectCandidate}
            election={this.props.election}
            toggleReviewAction={this.toggleShowBallotReview}
          />
        )}
      </Page>
    );
  }
  private selectCandidate(selectedCandidateIndex: number) {
    this.setState(currState => ({
      selectedCandidateIndex,
      selectedCandidate: currState.shuffledCandidates[selectedCandidateIndex],
    }));
  }
  private deselectCandidate() {
    this.setState({ selectedCandidateIndex: -1 });
  }

  private toggleShowBallotReview() {
    this.setState(currState => ({
      reviewingBallot: !currState.reviewingBallot,
    }));
  }
}

export default translate()(MajorityVote);
