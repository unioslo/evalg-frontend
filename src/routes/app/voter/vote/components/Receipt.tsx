import * as React from 'react';
import injectSheet from 'react-jss';
import { useTranslation } from 'react-i18next';
import Link from '../../../../../components/link';
import { Classes } from 'jss';
import { PageSection } from '../../../../../components/page';

const styles = (theme: any) => ({
  receiptTextBox: {
    ...theme.ingress,
    maxWidth: '63rem',
  },
});

interface IProps {
  classes: Classes;
}

function Receipt(props: IProps) {
  const { classes } = props;
  const { t } = useTranslation();

  return (
    <PageSection noBorder>
      <div className={classes.receiptTextBox}>
        {t('voter.receiptThankYou')}
        <br />
        <br />
        {t('voter.receiptVotingAgainInfo')}
        <br />
        <br />
        <Link to={'/'}>{t('voter.receiptGoToFrontpage')}</Link>{' '}
        {t('voter.receiptOr')}{' '}
        <Link to={'/logout'}>{t('voter.receiptLogout')}</Link>.
      </div>
    </PageSection>
  );
}

export default injectSheet(styles)(Receipt);
