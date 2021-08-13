import React from 'react';
import classNames from 'classnames';
import { createUseStyles, useTheme } from 'react-jss';

interface IProps {
  children?: React.ReactNode;
  dragged?: boolean;
  thickBorder?: boolean;
  actionTextOnHover?: boolean;
  noHoverBg?: boolean;
  noBorderBottom?: boolean;
  tall?: boolean;
  verticalPadding?: boolean;
  onClick?: (evnent: any) => void;
}

const useStyles = createUseStyles((theme: any) => ({
  row: {
    userSelect: 'text',
    padding: `0 ${theme.tableHorizontalPadding} 0 ${theme.tableHorizontalPadding}`,
    height: '6rem',
    borderBottom: `1px solid ${theme.tableCandidateBottomBorderColor}`,
  },
  clickable: {
    '&:hover': {
      backgroundColor: theme.tableRowHoverColor,
      cursor: 'pointer',
    },
  },
  actionTextOnHover: {
    '& .actiontext': {
      visibility: 'hidden',
    },
    '&:hover .actiontext': {
      visibility: 'visible',
    },
  },
  noHoverBg: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  noBorderBottom: {
    borderBottom: 'none',
  },
  tall: {
    height: '7.5rem',
  },
  isDragged: {
    borderTop: `1px solid ${theme.tableCandidateBottomBorderColor}`,
    backgroundColor: theme.tableRowDragColor,
    display: 'flex',
    justifyContent: 'space-between',
  },
  thickBorder: {
    borderBottom: `3px solid ${theme.tableThickBorderColor}`,
  },
  verticalPadding: {
    '& > td': {
      'padding-top': '2rem',
      'padding-bottom': '2rem',
    },
  },
}));

const TableRow: React.FunctionComponent<IProps> = (props) => {
  const {
    onClick,
    dragged,
    noHoverBg,
    noBorderBottom,
    thickBorder,
    actionTextOnHover,
    verticalPadding,
    tall,
  } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });
  const cls = classNames({
    [classes.row]: true,
    [classes.clickable]: onClick,
    [classes.isDragged]: dragged,
    [classes.noHoverBg]: noHoverBg,
    [classes.noBorderBottom]: noBorderBottom,
    [classes.thickBorder]: thickBorder,
    [classes.actionTextOnHover]: actionTextOnHover,
    [classes.verticalPadding]: verticalPadding,
    [classes.tall]: tall,
  });
  return (
    <tr className={cls} onClick={props.onClick}>
      {props.children}
    </tr>
  );
};

export default TableRow;
