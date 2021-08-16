import React from 'react';
import classNames from 'classnames';
import { createUseStyles, useTheme } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
  text: {
    fontWeight: 'normal',
    display: 'block',
  },
  alignCenter: {
    textAlign: 'center',
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
    },
  },
  h2: {
    fontSize: '2.4rem',
    lineHeight: '3.4rem',
  },
  h3: {
    fontSize: '2rem',
    lineHeight: '2.9rem',
    marginBottom: '2rem',
  },
  h4: {
    fontSize: '1.8rem',
    lineHeight: '2.5rem',
    marginBottom: '2rem',
  },
  h5: {
    fontSize: '1.6rem',
    lineHeight: '2rem',
    marginBlockStart: 0,
    marginBottom: '1rem',
  },
}));
interface IProps {
  children: any;
  bold?: boolean;
  size?: string;
  inline?: boolean;
  marginTop?: boolean;
  marginBottom?: boolean;
  alignCenter?: boolean;
}

const Text: React.FunctionComponent<IProps> = ({
  children,
  size,
  marginTop,
  marginBottom,
  inline,
  bold,
  alignCenter,
}) => {
  const theme = useTheme();
  const classes = useStyles({ theme });

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
    [classes.alignCenter]: alignCenter,
  });
  return <span className={cls}>{children}</span>;
};

const H1: React.FunctionComponent<{}> = (props) => {
  const { children } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });
  return <h1 className={classes.h1}>{children}</h1>;
};

const H2: React.FunctionComponent<{}> = (props) => {
  const { children } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });
  return <h2 className={classes.h2}>{children}</h2>;
};
const H3: React.FunctionComponent<{}> = (props) => {
  const { children } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });
  return <h3 className={classes.h3}>{children}</h3>;
};

const H4: React.FunctionComponent<{}> = (props) => {
  const { children } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });
  return <h4 className={classes.h4}>{children}</h4>;
};

const H5: React.FunctionComponent<{}> = (props) => {
  const { children } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });
  return <h5 className={classes.h5}>{children}</h5>;
};

export default Text;
export { H1, H2, H3, H4, H5 };
