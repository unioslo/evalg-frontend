import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles } from 'react-jss';

import Button, { ButtonContainer } from 'components/button';

const useStyles = createUseStyles({
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
});

interface FormButtonsProps {
  cancelDisabled?: boolean;
  closeAction?: (id: any) => void;
  customButtonText?: React.ReactNode | string;
  customButtonTextSubmitting?: React.ReactNode | string;
  entityAction?: any;
  entityActionDisabled?: boolean;
  entityText?: React.ReactNode | string;
  entityDanger?: boolean;
  submitDisabled: boolean;
  saveAction: (submitValues: any) => void;
  submitting?: boolean;
}

export default function FormButtons(props: FormButtonsProps) {
  const {
    saveAction,
    closeAction,
    submitDisabled,
    submitting,
    entityAction,
    entityActionDisabled,
    entityDanger,
    entityText,
    customButtonText,
    customButtonTextSubmitting,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <ButtonContainer alignRight>
      {entityAction && entityText && (
        <Button
          text={entityText}
          action={entityAction}
          disabled={entityActionDisabled}
          dangerButton={entityDanger}
          secondary={!entityDanger}
        />
      )}
      {closeAction && (
        <Button
          text={t('general.cancel')}
          disabled={submitting}
          action={closeAction}
          secondary
        />
      )}
      <Button
        text={
          submitting ? (
            <>
              {customButtonTextSubmitting
                ? customButtonTextSubmitting
                : t('general.saving')}
              <div className={classes.savingSpinner} />
            </>
          ) : (
            <>{customButtonText ? customButtonText : t('general.save')}</>
          )
        }
        disabled={submitDisabled}
        action={saveAction}
      />
    </ButtonContainer>
  );
}

FormButtons.defaultProps = {
  entityActionDisabled: false,
  entityDanger: false,
};
