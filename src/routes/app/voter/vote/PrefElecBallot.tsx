import * as React from 'react';
// import injectSheet from 'react-jss'

import PrefElecMobile from './components/PrefElecMobile';

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

interface IProps {
  election: Election
}

interface IState {
  selectedCandidates: Candidate[]
  shuffledCandidates: Candidate[]
}

class PrefElecBallot extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedCandidates: [],
      shuffledCandidates: shuffleArray(props.election.lists[0].candidates)
    };
    this.addCandidate = this.addCandidate.bind(this);
    this.moveCandidate = this.moveCandidate.bind(this);
    this.removeCandidate = this.removeCandidate.bind(this);
  }
  public render() {
    const unselectedCandidates = this.state.shuffledCandidates.filter(c =>
      this.state.selectedCandidates.indexOf(c) === -1
    )
    return (
      <PrefElecMobile
        selectedCandidates={this.state.selectedCandidates}
        unselectedCandidates={unselectedCandidates}
        addCandidate={this.addCandidate}
        removeCandidate={this.removeCandidate}
        moveCandidate={this.moveCandidate}
      />
    )
  }
  private addCandidate(candidate: Candidate) {
    console.error('ADD', candidate);
    this.setState({
      selectedCandidates: this.state.selectedCandidates.concat([candidate]),
    });
  }
  private removeCandidate(candidate: Candidate) {
    console.error('REMOVE', candidate);
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
}

export default PrefElecBallot;