/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

type Props = {
  children?: React.ChildrenArray<any>,
  alignLeft?: boolean,
  noTopMargin?: boolean,
  smlTopMargin?: boolean,
  classes: Object
};

const styles = theme => ({
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

const ButtonContainer = (props: Props) => {
  const { classes } = props;
  const cls = classNames({
    [classes.btnContainer]: true,
    [classes.alignLeft]: props.alignLeft,
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