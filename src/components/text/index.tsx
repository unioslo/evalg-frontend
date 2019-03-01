import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

interface ITextProps {
  children: any,
  bold?: boolean,
  size?: string,
  inline?: boolean,
  marginTop?: boolean,
  marginBottom?: boolean,
  classes: Classes,
};

const Text = ({
  classes,
  children,
  size,
  marginTop,
  marginBottom,
  inline,
  bold,
}: ITextProps) => {
  const textSize = size ? size : 'regular';
  const cls = classNames({
    [classes.text]: true,
    [classes.sm]: textSize === 'small',
    [classes.rgl]: textSize === 'regular',
    [classes.lg]: textSize === 'large',
    [classes.xl]: textSize === 'xlarge',
    [classes.marginTop]: marginTop,
    [classes.marginBottom]: marginBottom,
    [classes.inline]: inline,
    [classes.bold]: bold,
  });
  return <span className={cls}>{children}</span>;
};

const styles = (theme: any) => ({
  text: {
    fontWeight: 'normal',
    display: 'block',
  },
  sm: {
    fontSize: '1.4rem',
  },
  rgl: {
    fontSize: '1.6rem',
    lineHeight: '2.7rem',
  },
  lg: {
    fontSize: '2rem',
    lineHeight: '2.9rem',
  },
  xl: {
    fontSize: '2.4rem',
    lineHeight: '2.9rem',
  },
  bold: {
    fontWeight: 'bold',
  },
  inline: {
    display: 'inline-block',
  },
  marginTop: {
    marginTop: '1.8rem',
  },
  marginBottom: {
    marginBottom: '1.4rem',
  },
  h1: {
    fontSize: '2.8rem',
    lineHeight: '4.5rem',
    [`@media (min-width: ${theme.breakpoints.lg})`]: {
      fontSize: '3.6rem',
      lineHeight: '4.5rem',
    },
  },
  h2: {
    fontSize: '2.6rem',
    lineHeight: '3.4rem',
  },
  h3: {
    fontSize: '1.8rem',
    lineHeight: '2.9rem',
    fontWeight: 'normal',
    marginBottom: '2rem',
    [`@media (min-width: ${theme.breakpoints.lg})`]: {
      fontSize: '2rem',
    },
  },
});

interface IHeader {
  children: any,
  classes: Classes,
}

const H1 = ({ classes, children }: IHeader) => (
  <h1 className={classes.h1}>{children}</h1>
);

const H2 = ({ classes, children }: IHeader) => (
  <h2 className={classes.h2}>{children}</h2>
);

const H3 = ({ classes, children }: IHeader) => (
  <h3 className={classes.h2}>{children}</h3>
);

const StyledH1 = injectSheet(styles)(H1);
const StyledH2 = injectSheet(styles)(H2);
const StyledH3 = injectSheet(styles)(H3);

export default injectSheet(styles)(Text);

export { StyledH1 as H1, StyledH2 as H2, StyledH3 as H3 };
