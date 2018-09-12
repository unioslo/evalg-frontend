/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

type Props = {
  children?: React$Element<any> | Array<React$Element<any>>,
  dragged?: boolean,
  thickBorder?: boolean,
  actionTextOnHover?: boolean,
  noHoverBg?: boolean,
  tall?: boolean,
  verticalPadding?: boolean,
  classes: Object
}

const styles = theme => ({
  row: {
    userSelect: 'none',
    padding: `0 ${theme.tableHorizontalPadding} 0 ${theme.tableHorizontalPadding}`,
    height: '6rem',
    borderBottom: `1px solid ${theme.tableCandidateBottomBorderColor}`,
    '&:hover': {
      backgroundColor: theme.tableRowHoverColor
    }
  },
  actionTextOnhover: {
    '& .actiontext': {
      visibility: 'hidden'
    },
    '&:hover .actiontext': {
      visibility: 'visible'
    }
  },
  noHoverBg: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  tall: {
    height: '7.5rem'
  },
  isDragged: {
    borderTop: `1px solid ${theme.tableCandidateBottomBorderColor}`,
    backgroundColor: theme.tableRowDragColor,
    display: 'flex',
    justifyContent: 'space-between'
  },
  thickBorder: {
    borderBottom: `3px solid ${theme.tableThickBorderColor}`
  },
  verticalPadding: {
    '& > td': {
      'padding-top': '2rem',
      'padding-bottom': '2rem'
    }
  }
});

const TableRow = (props: Props) => {
  const { classes } = props;
  const cls = classNames({
    [classes.row]: true,
    [classes.isDragged]: props.dragged,
    [classes.noHoverBg]: props.noHoverBg,
    [classes.thickBorder]: props.thickBorder,
    [classes.actionTextOnHover]: props.actionTextOnHover,
    [classes.verticalPadding]: props.verticalPadding,
    [classes.tall]: props.tall
  });
  return (
    <tr className={cls}>
      {props.children}
    </tr>
  )
};

export default injectSheet(styles)(TableRow);