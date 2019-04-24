import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

const styles = (theme: any) => ({
  infoList: {
    listStyle: 'none',
    maxWidth: (props: IListProps) =>
      props.maxWidth ? props.maxWidth : 'inherit',
  },
  infoListItem: {
    fontSize: '1.6rem',
    color: theme.colors.greyishBrown,
    lineHeight: '2.7rem',
    marginTop: '1.3rem',
    '&:first-child': {
      marginTop: 0,
    },
  },
  infoListItemSmallText: {
    fontSize: '1.4rem',
    color: theme.colors.lightGreyishBrown,
  },
  infoListItemBulleted: {
    background: 'url("/listmarker.svg") no-repeat left 10px',
    [theme.breakpoints.mdQuery]: {
      marginLeft: '1.6rem',
    },
    paddingLeft: '1.3rem',
    marginTop: '0.3rem',
  },
  noLeftMargin: {
    marginLeft: 0,
  },
});

interface IListProps {
  children?: React.ReactNode;
  maxWidth?: string;
  classes: Classes;
}

const InfoList = (props: IListProps) => {
  return <ul className={props.classes.infoList}>{props.children}</ul>;
};

const StyledInfoList = injectSheet(styles)(InfoList);

interface IListItemProps {
  children?: React.ReactNode;
  smallText?: boolean;
  bulleted?: boolean;
  classes: Classes;
  noLeftMargin?: boolean;
}

const InfoListItem = (props: IListItemProps) => {
  const { classes } = props;
  const cls = classNames({
    [classes.infoListItem]: true,
    [classes.infoListItemBulleted]: props.bulleted,
    [classes.infoListItemSmallText]: props.smallText,
    [classes.noLeftMargin]: props.noLeftMargin,
  });
  return <li className={cls}>{props.children}</li>;
};

const StyledInfoListItem = injectSheet(styles)(InfoListItem);

export { StyledInfoList as InfoList, StyledInfoListItem as InfoListItem };
