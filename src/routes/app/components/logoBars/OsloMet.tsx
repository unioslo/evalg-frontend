import React from 'react';

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
    logo: {
        background: 'url("/oslomet/oslomet-app-logo.png") left center no-repeat',
        height: '6rem',
        backgroundSize: 'contain',
    },
}));


const OsloMetLogoBar: React.FunctionComponent = () => {
    const theme = useTheme();
    const classes = useStyles({ theme })

    return (
        <div className={classes.logoBarWrapper}>
            <div className={classes.logoBar}>
                <div className={classes.logo}/>
            </div>
        </div>
    );
};

export default OsloMetLogoBar;
