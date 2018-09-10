/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

type Props = {
  children?: React.ChildrenArray<any>,
  action?: Function,
  alignCenter?: boolean,
  alignRight?: boolean,
  classes: Object
}

const styles = theme => ({
  cell: {
    userSelect: 'none',
    fontWeight: 'normal',
    paddingTop: '0.4rem',
    '&:first-child': {
      paddingLeft: theme.tableHorizontalPadding
    },
    '&:last-child': {
      paddingRight: theme.tableHorizontalPadding
    }
  },
  alignCenter: {
    textAlign: 'center'
  },
  alignRight: {
    textAlign: 'right'
  },
  clickable: {
    '&:hover': {
      cursor: 'pointer'
    }
  }
});

const TableHeaderCell = (props: Props) => {
  const { classes } = props;
  const cls = classNames({
    [classes.cell]: true,
    [classes.alignCenter]: props.alignCenter,
    [classes.alignRight]: props.alignRight,
    [classes.clickable]: props.action
  });
  return (
    <th onClick={props.action}
      className={cls}>
      {props.children}
    </th>
  )
};

export default injectSheet(styles)(TableHeaderCell);