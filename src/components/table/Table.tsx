import React from 'react';
import classNames from 'classnames';
import { createUseStyles } from 'react-jss';

type TableProps = {
  marginTop?: string;
  children?: React.ReactNode;
};

const useStyles = createUseStyles({
  table: {
    width: '100%',
    userSelect: 'text',
    marginTop: (props: TableProps) =>
      props.marginTop ? props.marginTop : '4rem',
    '& th:not(:last-child), & td:not(:last-child)': {
      paddingRight: '2rem',
    },
  },
});

export default function Table(props: TableProps) {
  const { children } = props;
  const classes = useStyles({ ...props });

  const cls = classNames({
    [classes.table]: true,
  });
  return <table className={cls}>{children}</table>;
}
