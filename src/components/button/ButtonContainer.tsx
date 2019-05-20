import React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

interface IProps {
  alignLeft?: boolean,
  noTopMargin?: boolean,
  smlTopMargin?: boolean,
  center?: boolean,
  alignRight?: boolean,
  classes: Classes
};

const styles = (theme: any) => ({
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
      marginRight: 0
    },
  },
  alignLeft: {
    [theme.breakpoints.mdQuery]: {
      justifyContent: 'flex-start'
    }
  },
  center: {
    [theme.breakpoints.mdQuery]: {
      justifyContent: 'center'
    }
  },
  alignRight: {
    [theme.breakpoints.mdQuery]: {
      justifyContent: 'flex-end'
    }
  },
  smallTopMargin: {
    marginTop: '1rem',
    [theme.breakpoints.mdQuery]: {
      marginTop: '2rem'
    }
  },
  noTopMargin: {
    marginTop: 0
  }
});

const ButtonContainer: React.SFC<IProps> = (props) => {
  const { classes } = props;
  const cls = classNames({
    [classes.btnContainer]: true,
    [classes.alignLeft]: props.alignLeft,
    [classes.center]: props.center,
    [classes.alignRight]: props.alignRight,
    [classes.noTopMargin]: props.noTopMargin,
    [classes.smallTopMargin]: props.smlTopMargin
  });

  return (
    <div className={cls}>
      {props.children}
    </div>
  )
};

export default injectSheet(styles)(ButtonContainer);