import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

interface IProps {
  children?: any,
  action?: () => void,
  alignCenter?: boolean,
  alignRight?: boolean,
  classes: Classes,
}

const styles = (theme: any) => ({
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

const TableHeaderCell = (props: IProps) => {
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