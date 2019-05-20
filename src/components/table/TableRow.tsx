/* @flow */
import React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

interface IProps {
  children?: React.ReactNode,
  dragged?: boolean,
  thickBorder?: boolean,
  actionTextOnHover?: boolean,
  noHoverBg?: boolean,
  noBorderBottom?: boolean,
  tall?: boolean,
  verticalPadding?: boolean,
  onClick?: (evnent: any) => void,
  classes: Classes
}

const styles = (theme: any) => ({
  row: {
    userSelect: 'none',
    padding: `0 ${theme.tableHorizontalPadding} 0 ${theme.tableHorizontalPadding}`,
    height: '6rem',
    borderBottom: `1px solid ${theme.tableCandidateBottomBorderColor}`,
    '&:hover': {
      backgroundColor: theme.tableRowHoverColor,
      cursor: 'pointer',
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
  noBorderBottom: {
    borderBottom: 'none',
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

const TableRow = (props: IProps) => {
  const { classes } = props;
  const cls = classNames({
    [classes.row]: true,
    [classes.isDragged]: props.dragged,
    [classes.noHoverBg]: props.noHoverBg,
    [classes.noBorderBottom]: props.noBorderBottom,
    [classes.thickBorder]: props.thickBorder,
    [classes.actionTextOnHover]: props.actionTextOnHover,
    [classes.verticalPadding]: props.verticalPadding,
    [classes.tall]: props.tall
  });
  return (
    <tr className={cls} onClick={props.onClick}>
      {props.children}
    </tr>
  )
};

export default injectSheet(styles)(TableRow);