import React from 'react';

import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
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
  logoNo: {
    background: 'url("/uio-app-logo-nb.png") left center no-repeat',
    height: '4rem',
  },
  logoEn: {
    background: 'url("/uio-app-logo-en.png") left center no-repeat',
    height: '4rem',
  },
}));


const UiOLogoBar: React.FunctionComponent = () => {
  const theme = useTheme();
  const classes = useStyles({ theme })
  const { i18n } = useTranslation();

  return (
    <div className={classes.logoBarWrapper}>
      <div className={classes.logoBar}>
        <div className={i18n.language === 'en'
                      ? classes.logoEn
                      : classes.logoNo}/>
      </div>
    </div>
  );
};

export default UiOLogoBar;
