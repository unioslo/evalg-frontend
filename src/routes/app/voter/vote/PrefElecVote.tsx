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
};

const dummySubmit = () => console.error('SUBMIT!')

interface IProps extends TranslateHocProps {
  election: Election,
  electionName: any
}

interface IState {
  selectedCandidates: Candidate[]
  shuffledCandidates: Candidate[]
  reviewingBallot: boolean
}

class PrefElecVote extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      reviewingBallot: false,
      selectedCandidates: [],
      shuffledCandidates: shuffleArray(props.election.lists[0].candidates)

    };
    this.addCandidate = this.addCandidate.bind(this);
    this.moveCandidate = this.moveCandidate.bind(this);
    this.removeCandidate = this.removeCandidate.bind(this);
    this.toggleShowBallotReview = this.toggleShowBallotReview.bind(this);
  }
  public render() {
    const unselectedCandidates = this.state.shuffledCandidates.filter(c =>
      this.state.selectedCandidates.indexOf(c) === -1
    )
    const { i18n } = this.props;
    let lang = 'nb';
    if (i18n && i18n.language) {
      lang = i18n.language;
    }
    return (
      <Page header={this.props.electionName[lang]}>
        {this.state.reviewingBallot ?
          <PrefElecReview
            backAction={this.toggleShowBallotReview}
            candidates={this.state.selectedCandidates}
            submitAction={dummySubmit}

          /> :
          <PrefElecBallot
            selectedCandidates={this.state.selectedCandidates}
            unselectedCandidates={unselectedCandidates}
            addCandidate={this.addCandidate}
            removeCandidate={this.removeCandidate}
            moveCandidate={this.moveCandidate}
            election={this.props.election}
            reviewAction={this.toggleShowBallotReview}
          />
        }
      </Page >
    )
  }
  private addCandidate(candidate: Candidate) {
    this.setState({
      selectedCandidates: this.state.selectedCandidates.concat([candidate]),
    });
  }
  private removeCandidate(candidate: Candidate) {
    const selectedCandidates = this.state.selectedCandidates.filter(c =>
      c !== candidate
    );
    this.setState({ selectedCandidates });
  }
  private moveCandidate(oldIndex: number, newIndex: number) {
    const emptyArray: Candidate[] = [];
    const arrayCopy: Candidate[] = emptyArray.concat(
      this.state.selectedCandidates
    );
    moveArrayItem(arrayCopy, oldIndex, newIndex);
    this.setState({ selectedCandidates: arrayCopy })
  }
  private toggleShowBallotReview() {
    this.setState({ reviewingBallot: !this.state.reviewingBallot });
  }
}

export default translate()(PrefElecVote);