/* @flow */
import * as React from 'react';
import injectSheet from 'react-jss';

type Props = {
  children: React.ChildrenArray<any>,
  classes: Object
};

const styles = theme => ({
  wrapper: {
    flex: '1 0 auto',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    width: '100%'
  },
  container: {
    maxWidth: theme.appMaxWidth,
    flex: '1 0 auto',
    padding: `4rem ${theme.contentContainerHorPadding}`,
    [theme.breakpoints.mdQuery]: {
      padding: `4rem ${theme.contentContainerMdHorPadding}`
    }
  },
});

const Content = ({ classes, children }: Props) => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <div className={classes.content}>
          {children}
        </div>
      </div>
    </div>
  )
};

export default injectSheet(styles)(Content);
