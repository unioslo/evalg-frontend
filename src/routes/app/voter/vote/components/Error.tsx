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
  h1: { fontSize: '10rem' },
});

interface IProps {
  classes: Classes;
}

const Error: React.FunctionComponent<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const { classes } = props;

  return (
    <PageSection noBorder>
      <div className={classes.receiptTextBox}>
        <h1>{t('voter.error')}</h1>
        <br />
        <br />
        {t('voter.errorInfo')}
        <br />
        <br />
        <Link to={'/'}>{t('voter.receiptGoToFrontpage')}</Link>{' '}
        {t('voter.receiptOr')}{' '}
        <Link to={'/logout'}>{t('voter.receiptLogout')}</Link>.
      </div>
    </PageSection>
  );
};

export default injectSheet(styles)(Error);
