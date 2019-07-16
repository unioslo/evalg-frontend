import React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';
import { useTranslation } from 'react-i18next';

const styles = (theme: any) => ({
  errorText: {
    color: theme.errorTextColor,
  },
});

interface IProps {
  errorMessage: string;
  classes: Classes;
}

const ErrorInline: React.FunctionComponent<IProps> = ({
  errorMessage,
  classes,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <span className={classes.errorText}>{t('errors.generalError')}</span>:{' '}
      {errorMessage}
    </>
  );
};

export default injectSheet(styles)(ErrorInline);
