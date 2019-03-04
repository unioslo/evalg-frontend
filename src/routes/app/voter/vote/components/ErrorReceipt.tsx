import * as React from 'react';
import injectSheet from 'react-jss';
import { Trans, translate } from 'react-i18next';
import { TranslateHocProps } from 'react-i18next/src/translate';
import Link from '../../../../../components/link';

const styles = (theme: any) => ({
  header: {
    marginTop: '3rem',
    marginLeft: '1rem',
    fontSize: '3rem',
    color: 'red',
  },
  body: { marginTop: '3rem', marginLeft: '1rem' },
  footer: { marginTop: '3rem', marginLeft: '1rem' },
});

interface IProps extends TranslateHocProps {
  classes?: any;
}

const Receipt = ({ classes }: IProps) => {
  return (
    <div>
      <div className={classes.header}>
        <Trans>election.receiptErrorHeader</Trans>
      </div>
      <div className={classes.body}>
        <Trans>election.receiptErrorBody</Trans>
      </div>
      <div className={classes.footer}>
        <Link to={'/'}>
          <Trans>election.receiptGoToFrontpage</Trans>
        </Link>{' '}
        <Trans>election.receiptOr</Trans>{' '}
        <Link to={'/logout'}>
          <Trans>election.receiptLogout</Trans>
        </Link>
        .
      </div>
    </div>
  );
};

export default injectSheet(styles)(translate()(Receipt));
