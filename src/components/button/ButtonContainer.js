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
    [`media (min-width: ${theme.breakpoints.lg})`]: {
      marginTop: '4rem',
    },
    display: 'flex',
    justifyContent: 'flex-end',
    '& > button': {
      marginRight: '2rem',
    },
    '& > button:last-child': {
      marginRight: 0
    },
  },
  alignLeft: {
    justifyContent: 'flex-start'
  },
  smallTopMargin: {
    marginTop: '2rem',
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