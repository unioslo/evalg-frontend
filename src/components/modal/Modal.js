/* @flow */
import * as React from 'react';
import injectSheet from 'react-jss';
import classNames from 'classnames';

import { ButtonContainer } from '../button';
import CloseIcon from './icons/CloseIcon';

const styles = theme => ({
  modal: {
    zIndex: 9001,
    backgroundColor: 'white',
    //width: '90%',
    maxWidth: '1200px',
  },
  h1: {
    fontSize: '3.6rem',
    fontWeight: 'normal',
    marginBottom: '2rem',
    color: theme.colors.greyishBrown,
  },
  content: {
    padding: '1rem 4rem 4rem 4rem',
  },
  buttons: {
    diplay: 'flex',
    justifyContent: 'flex-end',
    padding: '2.5rem 3rem 3rem 3rem',
  },
  buttonContainer: { marginLeft: '2rem' },
  separator: {
    width: '100%',
    height: '0.3rem',
    border: '0.1rem',
    borderColor: theme.colors.darkWhite,
    'border-style': 'solid',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(223, 221, 221, 0.9)',
    overflow: 'visible',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: '100%',
    paddingTop: '2.2rem',
    paddingRight: '2.2rem',
    display: 'flex',
    justifyContent: 'flex-end',
    cursor: 'pointer',
    '&.hidden': {
      visibility: 'hidden',
    },
  },
});

type Props = {
  children?: React.Node,
  closeAction: Function,
  buttons: Array<ReactElement>,
  header: ReactElement | string,
  hideButtons?: boolean,
  hideTopCloseButton?: boolean,
  classes: Object,
};

const Modal = (props: Props) => {
  const { classes } = props;
  return (
    <div className={classes.overlay}>
      <div className={classes.modal}>
        <div
          className={classNames({
            [classes.closeIcon]: true,
            hidden: props.hideTopCloseButton,
          })}
        >
          <CloseIcon closeAction={props.closeAction} />
        </div>
        <div className={classes.content}>
          <h1 className={classes.h1}>{props.header}</h1>
          {props.children}
        </div>
        {(props.hideButtons === 'undefined' || !props.hideButtons) && (
          <div>
            <div className={classes.separator} />
            <div className={classes.buttons}>
              <ButtonContainer noTopMargin>{props.buttons}</ButtonContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default injectSheet(styles)(Modal);
