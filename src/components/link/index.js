import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';
import injectSheet from 'react-jss';

const styles = theme => ({
  link: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  internal: {
    color: theme.linkInternalColor,
    composes: '$link',
  },
  external: {
    color: theme.colors.blueish,
    composes: '$link',
  },
  marginRight: {
    marginRight: '3rem',
  },
  inheritColor: {
    color: 'inherit',
  },
  noUnderline: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
});

type Props = {
  to: string,
  external?: boolean,
  children?: ReactChildren,
  marginRight?: boolean,
  classes: Object,
};

const Link = (props: Props) => {
  const {
    to,
    external,
    children,
    marginRight,
    inheritColor,
    noUnderline,
    classes,
  } = props;
  const cls = classNames({
    [classes.internal]: !external,
    [classes.external]: external,
    [classes.marginRight]: marginRight,
    [classes.inheritColor]: inheritColor,
    [classes.noUnderline]: noUnderline,
  });
  if (external) {
    return (
      <a className={cls} href={to}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink className={cls} to={to}>
      {children}
    </RouterLink>
  );
};

export default injectSheet(styles)(Link);
