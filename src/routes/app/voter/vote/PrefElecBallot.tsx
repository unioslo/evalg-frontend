import * as React from 'react';
// import injectSheet from 'react-jss'

import { Candidate, SelectedPrefElecCandidate } from './components/Candidate';

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
    this.removeCandidate = this.removeCandidate.bind(this);
  }
  public render() {
    const unselectedCandidates = this.state.shuffledCandidates.filter(c =>
      this.state.selectedCandidates.indexOf(c) === -1
    )
    return (
      <div>
        <ul>
          {this.state.selectedCandidates.map((c, index) => (
            <SelectedPrefElecCandidate
              key={index}
              candidate={c}
              selectAction={this.removeCandidate}
            />
          ))}
        </ul>
        <ul>
          {unselectedCandidates.map((c, index) => (
            <Candidate
              key={index}
              candidate={c}
              selectAction={this.addCandidate}
            />
          ))}
        </ul>
      </div>
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
}

export default PrefElecBallot;