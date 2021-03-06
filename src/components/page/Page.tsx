import React from 'react';
import injectSheet from 'react-jss';
import { Helmet } from 'react-helmet';

interface IProps {
  header: string;
  classes: any;
}

const styles = (theme: any) => ({
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
});

const Page: React.SFC<IProps> = props => {
  const { header, classes, children } = props;
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

const StyledPage: any = injectSheet(styles)(Page);

export default StyledPage;
