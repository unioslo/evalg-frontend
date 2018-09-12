/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

type Props = {
  children: React.Node,
  alignCenter?: boolean,
  alignRight?: boolean,
  noPadding?: boolean,
  noBorder?: boolean,
  greyBg?: boolean,
  relative?: boolean,
  colspan?: string | number,
  topPadding?: boolean,
  classes: Object
}

const styles = theme => ({
  cell: {
    borderBottom: `1px solid ${theme.tableCandidateBottomBorderColor}`,
    userSelect: 'none',
    '&:first-child': {
      paddingLeft: theme.tableHorizontalPadding
    },
    '&:last-child': {
      paddingRight: theme.tableHorizontalPadding
    }
  },
  noPadding: {
    paddingLeft: '0 !important',
    paddingRight: '0 !important'
  },
  alignCenter: {
    textAlign: 'center'
  },
  alignRight: {
    textAlign: 'right'
  },
  noborder: {
    borderBottom: '0'
  },
  topPadding: {
    paddingTop: '3rem'
  },
  greyBg: {
    background: theme.tableCellGreyBgColor
  },
  relative: {
    position: 'relative'
  },
  dropdownArrow: {
    display: 'inline-block',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  infoUrl: {
    display: 'block',
    color: theme.actionTextColor,
    fontSize: '1.4rem'
  },
  searchFilter: {
    width: '22rem !important'
  },
  //nameInput: {
  //  height: '4.5rem',
  //  border: `2px solid ${theme.tableInputBorderInactive}`,
  //  borderRadius: '3px',
  //  padding: '0 3rem 0 1rem',
  //  marginTop: '1.5rem',
  //  fontSize: '1.6rem',
  //  color: theme.tableRowMainTextColor;
  //  &--active {
  //    border: 2px solid $tableInputBorderActive;
  //  }
  //  &--inactive {
  //    border: 2px solid $tableInputBorderInactive;
  //  }
  //}
  //&--urlinput {
  //  height: 3.5rem;
  //  border: 2px solid $tableInputBorderInactive;
  //  border-radius: 3px;
  //  padding: 0 3rem 0 1rem;
  //  margin-top: 2rem;
  //  font-size: 1.6rem;
  //  color: $tableRowMainTextColor;
  //  &--active {
  //    border: 2px solid $tableInputBorderActive;
  //  }
  //  &--inactive {
  //    border: 2px solid $tableInputBorderInactive;
  //  }
  //}
});

export const TableCell = (props: Props) => {
  const { classes } = props;
  const cls = classNames({
    [classes.cell]: true,
    [classes.alignCenter]: props.alignCenter,
    [classes.alignRight]: props.alignRight,
    [classes.noPadding]: props.noPadding,
    [classes.noPadding]: props.noBorder,
    [classes.greyBg]: props.greyBg,
    [classes.relative]: props.relative,
    [classes.topPadding]: props.topPadding
  });
  if (props.colspan) {
    return (
      <td className={cls} colSpan={props.colspan}>
        {props.children}
      </td>
    );
  }
  else {
    return (
      <td className={cls}>
        {props.children}
      </td>
    )
  }
};

export default injectSheet(styles)(TableCell);