import * as React from 'react';
import { translate } from 'react-i18next';
import { TranslateHocProps } from 'react-i18next/src/translate';

import { shuffleArray } from '../../../../utils/helpers';
import { Page, } from '../../../../components/page'
import PrefElecBallot from './components/PrefElecBallot';
import PrefElecReview from './components/PrefElecReview';
import { Election, Candidate } from '../../../../interfaces';

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
  election: Election,
  electionName: any
}

interface IState {
  selectedCandidates: Candidate[];
  shuffledCandidates: Candidate[];
  isReviewingBallot: boolean;
  isBlankVote: boolean;
}

class PrefElecVote extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isReviewingBallot: false,
      isBlankVote: false,
      selectedCandidates: [],
      shuffledCandidates: shuffleArray(props.election.lists[0].candidates),
    };
    this.handleAddCandidate = this.handleAddCandidate.bind(this);
    this.handleMoveCandidate = this.handleMoveCandidate.bind(this);
    this.handleRemoveCandidate = this.handleRemoveCandidate.bind(this);
    this.handleResetBallot = this.handleResetBallot.bind(this);
    this.handleReviewBallot = this.handleReviewBallot.bind(this);
    this.handleBlankVote = this.handleBlankVote.bind(this);
    this.handleGoBackToBallot = this.handleGoBackToBallot.bind(this);
    this.handleSubmitBallot = this.handleSubmitBallot.bind(this);
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

    return (
      <Page header={this.props.electionName[lang]}>
        {this.state.isReviewingBallot ? (
          <PrefElecReview
            selectedCandidates={this.state.selectedCandidates}

            // TODO fix: unselectedCandidates does not exist on PrefElecReview
            // unselectedCandidates={
            //   unselectedCandidates === undefined ? [] : unselectedCandidates
            // }
            isBlankVote={this.state.isBlankVote}
            onGoBackToBallot={this.handleGoBackToBallot}
            onSubmitBallot={this.handleSubmitBallot}
          />
        ) : (
          <PrefElecBallot
            selectedCandidates={this.state.selectedCandidates}
            unselectedCandidates={unselectedCandidates}
            election={this.props.election}
            onAddCandidate={this.handleAddCandidate}
            onRemoveCandidate={this.handleRemoveCandidate}
            onMoveCandidate={this.handleMoveCandidate}
            onResetBallot={this.handleResetBallot}
            onBlankVote={this.handleBlankVote}
            onReviewBallot={this.handleReviewBallot}
          />
        )}
      </Page>
    );
  }
  private handleSubmitBallot() {
    if (this.state.isBlankVote) {
      // TODO: Submit blank ballot
    } else {
      // TODO: Submit ballot
    }
  }

  private handleAddCandidate(candidate: Candidate) {
    this.setState(currState => ({
      selectedCandidates: currState.selectedCandidates.concat([candidate]),
    }));
  }

  private handleRemoveCandidate(candidate: Candidate) {
    const selectedCandidates = this.state.selectedCandidates.filter(
      c => c !== candidate
    );
    this.setState({ selectedCandidates });
  }

  private handleMoveCandidate(oldIndex: number, newIndex: number) {
    const emptyArray: Candidate[] = [];
    const arrayCopy: Candidate[] = emptyArray.concat(
      this.state.selectedCandidates
    );
    moveArrayItem(arrayCopy, oldIndex, newIndex);
    this.setState({ selectedCandidates: arrayCopy });
  }

  private handleResetBallot() {
    this.setState({ selectedCandidates: [] });
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

export default translate()(PrefElecVote);
