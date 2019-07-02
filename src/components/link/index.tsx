import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

const styles = (theme: any) => ({
  link: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  internal: {
    color: theme.linkInternalColor,
    composes: '$link',
  },
  external: {
    color: theme.linkExternalColor,
    composes: '$link',
  },
  externalIcon: {
    marginLeft: '1.2rem',
    position: 'relative',
    top: '1px',
    zIndex: '-1',
  },
  marginRight: {
    marginRight: '3rem',
  },
  inheritColor: {
    color: 'inherit',
  },
  underline: {
    textDecoration: 'underline',
  },
  noUnderline: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
});

interface IProps {
  to: string;
  external?: boolean;
  children?: React.ReactNode;
  marginRight?: boolean;
  noExternalIcon?: boolean;
  mail?: boolean;
  inheritColor?: boolean;
  underline?: boolean;
  noUnderline?: boolean;
  classes: Classes;
}

const Link = (props: IProps) => {
  const {
    to,
    external,
    noExternalIcon,
    mail,
    children,
    marginRight,
    inheritColor,
    underline,
    noUnderline,
    classes,
  } = props;
  const cls = classNames({
    [classes.internal]: !external,
    [classes.external]: external || mail,
    [classes.marginRight]: marginRight,
    [classes.inheritColor]: inheritColor,
    [classes.underline]: underline,
    [classes.noUnderline]: noUnderline,
  });

  const externalLinkIcon = (
    <svg width="15.3" height="12.6" viewBox="0 0 17 14">
      <g fill="#0F748D" fillRule="evenodd">
        <path d="M13.044 8.157h-.607a.3.3 0 0 0-.218.082.276.276 0 0 0-.085.208v2.907c0 .4-.148.742-.445 1.027a1.493 1.493 0 0 1-1.072.427H2.73c-.417 0-.774-.143-1.071-.427a1.371 1.371 0 0 1-.446-1.027V3.796c0-.4.149-.742.446-1.026a1.493 1.493 0 0 1 1.071-.427h6.674a.302.302 0 0 0 .218-.082.277.277 0 0 0 .085-.209v-.581a.277.277 0 0 0-.085-.21.302.302 0 0 0-.218-.08H2.73c-.752 0-1.395.255-1.93.767-.533.511-.8 1.128-.8 1.848v7.558c0 .721.267 1.337.801 1.849a2.689 2.689 0 0 0 1.93.768h7.886c.752 0 1.395-.256 1.93-.768.534-.512.8-1.128.8-1.849V8.448a.276.276 0 0 0-.085-.21.302.302 0 0 0-.218-.081z" />
        <path d="M16.807.19a.596.596 0 0 0-.426-.173h-4.854a.596.596 0 0 0-.426.173.548.548 0 0 0-.18.409c0 .157.06.294.18.409l1.668 1.598-6.18 5.923a.281.281 0 0 0-.095.21c0 .078.031.148.094.208L7.67 9.983a.306.306 0 0 0 .436 0l6.18-5.923 1.67 1.599c.12.115.262.172.426.172a.596.596 0 0 0 .426-.172.547.547 0 0 0 .18-.409V.599a.548.548 0 0 0-.18-.409z" />
      </g>
    </svg>
  );

  if (external) {
    return (
      <a className={cls} href={to} target="_blank">
        {children}
        {!noExternalIcon && (
          <span className={classes.externalIcon}>{externalLinkIcon}</span>
        )}
      </a>
    );
  } else if (mail) {
    return (
      <a className={cls} href={`mailto:${to}`}>
        {children}
      </a>
    );
  } else {
    return (
      <RouterLink className={cls} to={to}>
        {children}
      </RouterLink>
    );
  }
};

export default injectSheet(styles)(Link);
