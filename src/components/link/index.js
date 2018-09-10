import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';
import injectSheet from 'react-jss';

type Props = {
  to: string,
  external?: boolean,
  children?: ReactChildren,
  marginRight?: boolean,
  classes: Object
}

const styles = theme => ({
  link: {
    fontSize: '1.6rem',
    display: 'inline-flex',
    alignItems: 'center'
  },
  internal: {
    color: theme.linkInternalColor,
    composes: '$link'
  },
  external: {
    color: theme.blueish,
    composes: '$link'
  },
  marginRight: {
    marginRight: '3rem'
  }
})

const Link = (props: Props) => {
  const { to, external, children, marginRight, classes } = props;
  const cls = classNames({
    [classes.internal]: !external,
    [classes.external]: external,
    [classes.marginRight]: marginRight
  });
  if (external) {
    return (
      <a className={cls} href={to}>{children}</a>
    );
  }
  return (
    <RouterLink className={cls} to={to}>{children}</RouterLink>
  );
};

export default injectSheet(styles)(Link);