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
        backgroundColor: theme.headerMainAreaColor,
    },
    logoNo: {
        background: 'url("/hiof/logo-no.svg") left center no-repeat',
        height: '6rem',
    },
    logoEn: {
        background: 'url("/hiof/logo-en.svg") left center no-repeat',
        height: '6rem',
    },
}));


const HiOFLogoBar: React.FunctionComponent = () => {
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

export default HiOFLogoBar;
