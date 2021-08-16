import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { useTranslation } from 'react-i18next';

const useStyles = createUseStyles((theme: any) => ({
  errorText: {
    color: theme.errorTextColor,
  },
}));

interface IProps {
  errorMessage: string;
}

const ErrorInline: React.FunctionComponent<IProps> = ({ errorMessage }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <>
      <span className={classes.errorText}>{t('errors.generalError')}</span>:{' '}
      {errorMessage}
    </>
  );
};

export default ErrorInline;
