/* @flow */
import * as React from 'react';

import { Trans } from 'react-i18next';
import Button, { ButtonContainer } from '../../components/button';
import injectSheet from 'react-jss';

const styles = (theme: any) => ({
  savingSpinner: {
    position: 'relative',
    top: -5,
    marginLeft: 10,
    marginRight: -2,
    display: 'inline-block',
    width: '2.5rem',
    height: '2.5rem',
    border: '3px solid rgba(255,255,255,.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 0.8s linear infinite',
    '-webkit-animation': 'spin 0.8s linear infinite',
  },

  '@keyframes spin': {
    to: { '-webkit-transform': 'rotate(360deg)' },
  }
});

interface IProps {
  saveAction: (submitValues: any) => void;
  closeAction: (id: any) => void;
  submitDisabled: boolean;
  cancelDisabled?: boolean;
  submitting?: boolean;
  entityAction?: any;
  entityText?: React.ReactNode | string;
  classes: any;
}

const FormButtons = (props: IProps) => {
  const {
    saveAction,
    closeAction,
    submitDisabled,
    submitting,
    entityAction,
    entityText,
  } = props;
  return (
    <ButtonContainer alignRight={true}>
      {entityAction && entityText && (
        <Button text={entityText} action={entityAction} secondary={true} />
      )}
      <Button
        text={<Trans>general.cancel</Trans>}
        disabled={submitting}
        action={closeAction}
        secondary={true}
      />
      <Button
        text={
          submitting ? (
            <>
              <Trans>general.saving</Trans>
              <div className={props.classes.savingSpinner} />
            </>
          ) : (
            <Trans>general.save</Trans>
          )
        }
        disabled={submitDisabled}
        action={saveAction}
      />
    </ButtonContainer>
  );
};

export default injectSheet(styles)(FormButtons);
