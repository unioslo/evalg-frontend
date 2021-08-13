import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import { PageSection } from 'components/page';

const useStyles = createUseStyles((theme: any) => ({
  body: {
    color: theme.errorTextColor,
  },
  generalInfo: {
    marginBottom: '2rem',
  },
}));

interface IProps {
  errorHeader?: string;
  errorGeneralInfo?: string;
  errorMessage?: string;
}

const ErrorPageSection: React.FunctionComponent<IProps> = ({
  errorHeader,
  errorGeneralInfo,
  errorMessage,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <PageSection header={errorHeader || t('errors.generalError')}>
      <div className={classes.body}>
        {errorGeneralInfo && (
          <div className={classes.generalInfo}>{errorGeneralInfo}</div>
        )}
        {errorMessage && `${t('errors.errorMessage')}: ${errorMessage}`}
      </div>
    </PageSection>
  );
};

export default ErrorPageSection;
