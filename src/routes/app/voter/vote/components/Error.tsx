import React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';
import { useTranslation } from 'react-i18next';

import Link from 'components/link';
import { Page, PageSection } from 'components/page';

const styles = (theme: any) => ({
  receiptTextBox: {
    ...theme.ingress,
    maxWidth: '63rem',
  },
  h1: { fontSize: '10rem' },
});

interface IProps {
  classes: Classes;
}

const Error: React.FunctionComponent<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const { classes } = props;

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

export default injectSheet(styles)(Error);
