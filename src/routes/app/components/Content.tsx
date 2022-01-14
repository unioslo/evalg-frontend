import React from 'react';
import classNames from 'classnames';
import { createUseStyles, useTheme } from 'react-jss';

interface IProps {
  isLoginPage?: boolean;
}

const useStyles = createUseStyles((theme: any) => ({
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
}));

const Content: React.FunctionComponent<IProps> = ({
  isLoginPage,
  children,
}) => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const wrapperCls = classNames({
    [classes.wrapper]: true,
    [classes.wrapperLoginPage]: isLoginPage,
  });
  const containerCls = classNames({
    [classes.container]: true,
    [classes.containerLoginPage]: isLoginPage,
  });

  return (
    <main className={wrapperCls}>
      <div className={containerCls}>
        <div className={classes.content}>{children}</div>
      </div>
    </main>
  );
};

export default Content;
