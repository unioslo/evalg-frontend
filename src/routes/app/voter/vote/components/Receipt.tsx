import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import { feedbackUrl } from 'appConfig';
import Link from 'components/link';
import { PageSection } from 'components/page';

const useStyles = createUseStyles((theme: any) => ({
  receiptTextBox: {
    ...theme.ingress,
    maxWidth: '63rem',
  },
}));

const Receipt: React.FunctionComponent<{}> = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });


  return (
    <PageSection noBorder>
      <div className={classes.receiptTextBox}>
        {t('voter.receiptThankYou')}
        <br />
        <br />
        {t('voter.receiptVotingAgainInfo')}
        <br />
        {feedbackUrl && (
          <>
            <br />
            <Link external to={feedbackUrl}>
              {t('voter.feedback')}
            </Link>
            <br />
          </>
        )}
        <br />
        <Link to="/">{t('voter.receiptGoToFrontpage')}</Link>{' '}
        {t('voter.receiptOr')}{' '}
        <Link to="/logout">{t('voter.receiptLogout')}</Link>.
      </div>
    </PageSection>
  );
};

export default Receipt;
