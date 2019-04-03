import React from 'react';
import { PageSection } from '../page';
import { Classes } from 'jss';
import injectSheet from 'react-jss';
import { useTranslation } from 'react-i18next';

const styles = (theme: any) => ({
  body: {
    color: 'red',
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
