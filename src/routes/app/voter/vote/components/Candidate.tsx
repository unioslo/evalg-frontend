import * as React from 'react';

interface ICandidateProps {
  candidate: Candidate
  selectAction: (c: Candidate) => void
}

const Candidate: React.SFC<ICandidateProps> = props => {
  const handleClick = () => props.selectAction(props.candidate)
  return (
    <div>
      <div onClick={handleClick}>
        Add
      </div>
      <div>{props.candidate.name}</div>
    </div>
  )
}

interface ISelectedPrefElecCandProps {
  candidate: Candidate
  selectAction: (c: Candidate) => void
}

const SelectedPrefElecCandidate: React.SFC<ISelectedPrefElecCandProps> = props => {
  const handleClick = () => props.selectAction(props.candidate)
  return (
    <div>
      <div onClick={handleClick}>Remove</div>
      <div>{props.candidate.name}</div>
    </div>
  )
}

export {
  Candidate, SelectedPrefElecCandidate
};