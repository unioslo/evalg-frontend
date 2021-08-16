import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import Link from 'components/link';
import { Page, PageSection } from 'components/page';

const useStyles = createUseStyles((theme: any) => ({
  receiptTextBox: {
    ...theme.ingress,
    maxWidth: '63rem',
  },
  h1: { fontSize: '10rem' },
}));


const Error: React.FunctionComponent<{}> = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <Page header={t('voter.error')}>
      <PageSection noBorder>
        <div className={classes.receiptTextBox}>
          <div dangerouslySetInnerHTML={{ __html: t('voter.errorInfo') }} />
          <br />
          <br />
          <Link to={'/'}>{t('voter.receiptGoToFrontpage')}</Link>{' '}
          {t('voter.receiptOr')}{' '}
          <Link to={'/logout'}>{t('voter.receiptLogout')}</Link>.
        </div>
      </PageSection>
    </Page>
  );
};

export default Error;
