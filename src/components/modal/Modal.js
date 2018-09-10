/* @flow */
import * as React from 'react';

import { ButtonContainer } from '../button';
import CloseIcon from './icons/CloseIcon';

type Props = {
  children?: ReactChildren,
  closeAction: Function,
  buttons: Array<ReactElement>,
  header: ReactElement | string,
  hideButtonSeparator?: bool
}

const Modal = (props: Props) => {
  return (
    <div className="modal--overlay">
      <div className="modal">
        <div className="modal--close-icon">
          <CloseIcon closeAction={props.closeAction} />
        </div>
        <div className="modal--content">
          <h1 className="modal--content--header">
            {props.header}
          </h1>
          {props.children}
        </div>
        {(props.hideButtonSeparator === 'undefined' || !props.hideButtonSeparator) &&
          <div>
            <div className="modal--separator" />
            <div className="modal--buttons">
              <ButtonContainer noTopMargin>
                {props.buttons}
              </ButtonContainer>
            </div>
          </div>
        }
      </div>
    </div>
  )
};

export default Modal;
