import * as React from 'react';
import injectSheet from 'react-jss';

interface IProps {
  header: JSX.Element | React.SFC | string;
  classes: any;
}

const styles = (theme: any) => ({
  header: {
    color: theme.contentPageHeaderColor,
    fontSize: '3rem',
    fontWeight: 'bold',
    margin: `0rem ${theme.contentHorPadding} 0 ${theme.contentHorPadding}`,
    [theme.breakpoints.mdQuery]: {
      fontWeight: 'normal',
      fontSize: '3.6rem',
      margin: `4rem ${theme.contentHorMdPadding} 0 ${
        theme.contentHorMdPadding
      }`,
    },
  },
});

const Page: React.SFC<IProps> = props => (
  <div>
    <h1 className={props.classes.header}>{props.header}</h1>
    {props.children}
  </div>
);

const StyledPage: any = injectSheet(styles)(Page);

export default StyledPage;
