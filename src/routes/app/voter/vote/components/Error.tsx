import * as React from 'react';
import injectSheet from 'react-jss';
import { Trans, translate } from 'react-i18next';
import { TranslateHocProps } from 'react-i18next/src/translate';
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

interface IProps extends TranslateHocProps {
  classes: Classes;
}

const Error: React.SFC<IProps> = ({ classes }) => {
  return (
    <PageSection noBorder>
      <div className={classes.receiptTextBox}>
        <h1>
          <Trans>voter.error</Trans>
        </h1>
        <br />
        <br />
        <Trans>voter.errorInfo</Trans>
        <br />
        <br />
        <Link to={'/'}>
          <Trans>voter.receiptGoToFrontpage</Trans>
        </Link>{' '}
        <Trans>voter.receiptOr</Trans>{' '}
        <Link to={'/logout'}>
          <Trans>voter.receiptLogout</Trans>
        </Link>
        .
      </div>
    </PageSection>
  );
};

export default injectSheet(styles)(translate()(Error));
