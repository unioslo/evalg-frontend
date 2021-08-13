import React from 'react';
import { Trans } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import Button, { ButtonContainer } from 'components/button';

const useStyles = createUseStyles((theme: any) => ({
  savingSpinner: {
    position: 'relative',
    marginLeft: 10,
    marginRight: -2,
    display: 'inline-block',
    width: '2.3rem',
    height: '2.3rem',
    border: '3px solid rgba(255,255,255,.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 0.8s linear infinite',
    '-webkit-animation': 'spin 0.8s linear infinite',
  },

  '@keyframes spin': {
    to: { '-webkit-transform': 'rotate(360deg)' },
  },
}));

interface IProps {
  saveAction: (submitValues: any) => void;
  closeAction: (id: any) => void;
  submitDisabled: boolean;
  cancelDisabled?: boolean;
  submitting?: boolean;
  entityAction?: any;
  entityActionDisabled?: boolean;
  entityText?: React.ReactNode | string;
}

const FormButtons: React.FunctionComponent<IProps> = (props) => {
  const {
    saveAction,
    closeAction,
    submitDisabled,
    submitting,
    entityAction,
    entityActionDisabled,
    entityText,
  } = props;
  const theme = useTheme();
  const classes = useStyles({ theme })

  return (
    <ButtonContainer alignRight>
      {entityAction && entityText && (
        <Button
          text={entityText}
          action={entityAction}
          disabled={entityActionDisabled}
          secondary
        />
      )}
      <Button
        text={<Trans>general.cancel</Trans>}
        disabled={submitting}
        action={closeAction}
        secondary
      />
      <Button
        text={
          submitting ? (
            <>
              <Trans>general.saving</Trans>
              <div className={classes.savingSpinner} />
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

FormButtons.defaultProps = {
  entityActionDisabled: false,
};

export default FormButtons;
