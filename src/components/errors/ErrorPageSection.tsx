import React from 'react';
import { Classes } from 'jss';
import injectSheet from 'react-jss';
import { useTranslation } from 'react-i18next';

import { PageSection } from 'components/page';

const styles = (theme: any) => ({
  body: {
    color: theme.errorTextColor,
  },
  generalInfo: {
    marginBottom: '2rem',
  },
});

interface Props {
  errorHeader?: string;
  errorGeneralInfo?: string;
  errorMessage?: string;
  classes: Classes;
}

const ErrorPageSection: React.FunctionComponent<Props> = ({
  errorHeader,
  errorGeneralInfo,
  errorMessage,
  classes,
}) => {
  const { t } = useTranslation();

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

export default injectSheet(styles)(ErrorPageSection);
