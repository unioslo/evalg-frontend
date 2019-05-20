import React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

interface IProps {
  classes: Classes;
}

const styles = (theme: any) => ({
  wrapper: {
    flex: '1 0 auto',
  },
  content: {
    width: '100%',
  },
  container: {
    margin: '0 auto',
    maxWidth: theme.appMaxWidth,
    padding: `4rem ${theme.contentContainerHorPadding}`,
    [theme.breakpoints.mdQuery]: {
      padding: `4rem ${theme.contentContainerMdHorPadding}`,
    },
  },
});

const Content: React.SFC<IProps> = ({ classes, children }) => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <div className={classes.content}>{children}</div>
      </div>
    </div>
  );
};

export default injectSheet(styles)(Content);
