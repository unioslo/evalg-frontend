import React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

interface IProps {
  isLoginPage?: boolean;
  classes: Classes;
}

const styles = (theme: any) => ({
  wrapper: {
    flex: '1 0 auto',
  },
  wrapperLoginPage: {
    backgroundColor: theme.loginPageBgColor,
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
  containerLoginPage: {
    padding: '2rem 0',
    [theme.breakpoints.mdQuery]: {
      padding: '4rem 0',
    },
  },
});

const Content: React.SFC<IProps> = ({ isLoginPage: isLoginPage, classes, children }) => {
  const wrapperCls = classNames({
    [classes.wrapper]: true,
    [classes.wrapperLoginPage]: isLoginPage,
  });
  const containerCls = classNames({
    [classes.container]: true,
    [classes.containerLoginPage]: isLoginPage,
  });

  return (
    <div className={wrapperCls}>
      <div className={containerCls}>
        <div className={classes.content}>{children}</div>
      </div>
    </div>
  );
};

export default injectSheet(styles)(Content);
