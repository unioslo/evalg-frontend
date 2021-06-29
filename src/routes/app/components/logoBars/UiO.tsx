import React from 'react';

import { Classes } from 'jss';
import injectSheet from 'react-jss';

const styles = (theme: any) => ({
  logoBar: {
    margin: '0 auto',
    maxWidth: theme.appMaxWidth,
    padding: `0 ${theme.horizontalPadding}`,
    [theme.breakpoints.mdQuery]: {
      padding: `0 ${theme.horizontalMdPadding}`,
    },
  },
  logoBarWrapper: {
    backgroundColor: theme.colors.black,
  },
  // TODO: Add english logo
  logo: {
    background: 'url("/uio-app-logo-nb.png") left center no-repeat',
    height: '4rem',
  },
});

interface IProps {
  classes: Classes;
}

const UiOLogoBar: React.FunctionComponent<IProps> = props => {
  const { classes } = props;

  return (
    <div className={classes.logoBarWrapper}>
      <div className={classes.logoBar}>
        <div className={classes.logo} />
      </div>
    </div>
  );
};

export default injectSheet(styles)(UiOLogoBar);
