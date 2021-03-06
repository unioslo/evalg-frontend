import React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';
import { useTranslation } from 'react-i18next';

import Link from 'components/link';
import { PageSection } from 'components/page';

const styles = (theme: any) => ({
  receiptTextBox: {
    ...theme.ingress,
    maxWidth: '63rem',
  },
});

interface IProps {
  classes: Classes;
}

const Receipt: React.FunctionComponent<IProps> = (props: IProps) => {
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
        <Link external={true} to={'https://nettskjema.no/a/valg3'}>
          {t('voter.feedback')}
        </Link>
        <br />
        <br />
        <Link to={'/'}>{t('voter.receiptGoToFrontpage')}</Link>{' '}
        {t('voter.receiptOr')}{' '}
        <Link to={'/logout'}>{t('voter.receiptLogout')}</Link>.
      </div>
    </PageSection>
  );
};

export default injectSheet(styles)(Receipt);
