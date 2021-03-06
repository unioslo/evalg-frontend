import React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';
import FocusTrap from 'focus-trap-react';

import { ButtonContainer } from 'components/button';
import CloseIcon from './icons/CloseIcon';

const styles = (theme: any) => ({
  modal: {
    zIndex: 9001,
    backgroundColor: 'white',
    maxWidth: '1200px',
    minWidth: (props: IProps) => (props.minWidth ? props.minWidth : 'none'),
    position: 'relative', // for close icon positioning
  },
  heading: {
    fontSize: '3.6rem',
    fontWeight: 'normal',
    marginBottom: '3rem',
    color: theme.colors.greyishBrown,
  },
  content: {
    padding: '4rem',
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
    position: 'absolute',
    top: '2rem',
    right: '2rem',
    width: '2rem',
    height: '2rem',
    cursor: 'pointer',
  },
});

interface IProps {
  children?: React.ReactNode;
  closeAction?: (a: any) => void;
  buttons: any[];
  header: any | string;
  hideButtons?: boolean;
  hideTopCloseButton?: boolean;
  minWidth?: string;
  classes: Classes;
}

const Modal = (props: IProps) => {
  const { classes } = props;
  return (
    <div className={classes.overlay}>
      <FocusTrap>
        <div className={classes.modal}>
          {props.closeAction && !props.hideTopCloseButton && (
            <div className={classes.closeIcon}>
              <CloseIcon closeAction={props.closeAction} />
            </div>
          )}
          <div className={classes.content}>
            <h1 className={classes.heading}>{props.header}</h1>
            {props.children}
          </div>
          {!props.hideButtons && (
            <div>
              <div className={classes.separator} />
              <div className={classes.buttons}>
                <ButtonContainer noTopMargin>{props.buttons}</ButtonContainer>
              </div>
            </div>
          )}
        </div>
      </FocusTrap>
    </div>
  );
};

export default injectSheet(styles)(Modal);
