import * as React from 'react';

interface IProps {
  selected: boolean
}

const SelectCandidateIcon: React.SFC<IProps> = props => {
  if (props.selected) {
    return (
      <svg width="51px" height="46px" viewBox="0 0 51 62" version="1.1">
        <g stroke="none" strokeWidth="1" fill="none">
          <g id="Group">
            <rect fill="#D5EBEF" x="0" y="0" width="51" height="62" rx="8" />
            <g transform="translate(12.000000, 17.000000)">
              <circle stroke="#8ECED9" strokeWidth="3" cx="14" cy="14" r="12.5" />
              <circle fill="#2294A8" cx="14" cy="14" r="5" />
            </g>
          </g>
        </g>
      </svg>
    )
  }
  return (
    <svg width="51px" height="46px" viewBox="0 0 51 62" version="1.1">
      <g stroke="none" strokeWidth="1" fill="none">
        <g id="Group">
          <rect fill="#F9F4FA" x="0" y="0" width="51" height="62" rx="8" />
          <g transform="translate(12.000000, 17.000000)">
            <circle stroke="#8ECED9" strokeWidth="3" cx="14" cy="14" r="12.5" />
          </g>
        </g>
      </g>
    </svg>
  )
}

export default SelectCandidateIcon;