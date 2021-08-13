import React from 'react';
import classNames from 'classnames';
import { createUseStyles, useTheme } from 'react-jss';

interface IProps {
  alignLeft?: boolean;
  noTopMargin?: boolean;
  smlTopMargin?: boolean;
  center?: boolean;
  alignRight?: boolean;
}

const useStyles = createUseStyles((theme: any) => ({
  btnContainer: {
    marginTop: '2rem',
    [theme.breakpoints.mdQuery]: {
      justifyContent: 'flex-end',
      marginTop: '4rem',
    },
    display: 'flex',
    justifyContent: 'space-between',
    '& > *': {
      [theme.breakpoints.mdQuery]: {
        marginRight: '2rem',
      },
      marginRight: '1rem',
    },
    '& > *:last-child': {
      marginRight: 0,
    },
  },
  alignLeft: {
    [theme.breakpoints.mdQuery]: {
      justifyContent: 'flex-start',
    },
  },
  center: {
    [theme.breakpoints.mdQuery]: {
      justifyContent: 'center',
    },
  },
  alignRight: {
    [theme.breakpoints.mdQuery]: {
      justifyContent: 'flex-end',
    },
  },
  smallTopMargin: {
    marginTop: '1rem',
    [theme.breakpoints.mdQuery]: {
      marginTop: '2rem',
    },
  },
  noTopMargin: {
    marginTop: 0,
  },
}));

const ButtonContainer: React.FunctionComponent<IProps> = (props) => {
  const { alignLeft, alignRight, center, children, noTopMargin, smlTopMargin } =
    props;
  const theme = useTheme();
  const classes = useStyles({ theme });
  const cls = classNames({
    [classes.btnContainer]: true,
    [classes.alignLeft]: alignLeft,
    [classes.center]: center,
    [classes.alignRight]: alignRight,
    [classes.noTopMargin]: noTopMargin,
    [classes.smallTopMargin]: smlTopMargin,
  });

  return <div className={cls}>{children}</div>;
};

export default ButtonContainer;
