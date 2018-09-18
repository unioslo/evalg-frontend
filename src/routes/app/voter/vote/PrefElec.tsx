import * as React from 'react';
import { translate } from 'react-i18next';
import { TranslateHocProps } from 'react-i18next/src/translate';
// import injectSheet from 'react-jss'


import { Page, } from 'components/page'

import PrefElecReview from './components/PrefElecReview';
import PrefElecVoteMobile from './components/PrefElecVoteMobile';


function shuffleArray<T>(array: T[]): T[] {
  const emptyArray: T[] = [];
  const shuffledArray = emptyArray.concat(array);
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffledArray[i];
    shuffledArray[i] = shuffledArray[j];
    shuffledArray[j] = temp;
  }
  return shuffledArray;
}

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
  electionName: NameFields
}

interface IState {
  selectedCandidates: Candidate[]
  shuffledCandidates: Candidate[]
  reviewingBallot: boolean
}

class PrefElecBallot extends React.Component<IProps, IState> {
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
          <PrefElecVoteMobile
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

export default translate()(PrefElecBallot);