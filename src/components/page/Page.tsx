import React from 'react';
import { Helmet } from 'react-helmet';
import { createUseStyles, useTheme } from 'react-jss';

interface IProps {
  header: string;
}

const useStyles = createUseStyles((theme: any) => ({
  page: {
    display: 'block',
    [theme.breakpoints.mdQuery]: {
      marginTop: '5rem',
    },
  },
  header: {
    color: theme.contentPageHeaderColor,
    fontSize: '3rem',
    fontWeight: 'bold',
    margin: `0rem ${theme.contentHorPadding} 0 ${theme.contentHorPadding}`,
    [theme.breakpoints.mdQuery]: {
      fontWeight: 'normal',
      fontSize: '3.6rem',
      marginLeft: `${theme.contentHorMdPadding}`,
      marginRight: `${theme.contentHorMdPadding}`,
    },
  },
}));

const Page: React.FunctionComponent<IProps> = props => {
  const { header, children } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <>
      <Helmet>
        <title>{header}</title>
      </Helmet>
      <main className={classes.page}>
        <h1 className={classes.header}>{header}</h1>
        {children}
      </main>
    </>
  );
};

const StyledPage: any = Page;
export default StyledPage;
