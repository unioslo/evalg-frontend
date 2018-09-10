/* @flow */
import * as React from 'react';

type Props = {
	closeAction: Function
}

const CloseIcon = (props: Props) => {
  return (
    <svg width="19px" height="19px" viewBox="0 0 19 19" onClick={props.closeAction} >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" className="closeicon--circle">
        <circle cx="9.5" cy="9.5" r="9.5" className="closebutton--circle"></circle>
        <rect className="closeicon--line" transform="translate(9.500000, 9.500000) rotate(45.000000) translate(-9.500000, -9.500000) " x="8" y="2.5" width="3" height="14" rx="0.8"></rect>
        <rect className="closeicon--line" transform="translate(9.500000, 9.500000) rotate(-45.000000) translate(-9.500000, -9.500000) " x="8" y="2.5" width="3" height="14" rx="0.8"></rect>
      </g>
    </svg>
  )
};

export default CloseIcon;
