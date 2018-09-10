import * as React from 'react';
import injectSheet from 'react-jss';

interface IProps {
  header: JSX.Element | React.SFC | string,
  classes: any
}

const styles = (theme: any) => ({
  header: {
    color: theme.contentPageHeaderColor,
    fontWeight: 'bold',
    margin: 0,
    [`media (min-width: ${theme.breakpoints.lg})`]: {
      fontWeight: 'normal',
      margin: `4rem ${theme.contentHorMdPadding} 0 ${theme.contentHorMdPadding}`
    }
  }
})

const Page: React.SFC<IProps> = (props) => (
  <div>
    <h1 className={props.classes.header}>{props.header}</h1>
    {props.children}
  </div>
);

const StyledPage: any = injectSheet(styles)(Page);

export default StyledPage;

