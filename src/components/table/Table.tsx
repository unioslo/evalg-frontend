import React from 'react';
import classNames from 'classnames';
import { createUseStyles, useTheme } from 'react-jss';

interface IProps {
  marginTop?: string;
}

const useStyles = createUseStyles((theme: any) => ({
  table: {
    width: '100%',
    userSelect: 'text',
    marginTop: (props: IProps) => (props.marginTop ? props.marginTop : '4rem'),
    '& th:not(:last-child), & td:not(:last-child)': {
      paddingRight: '2rem',
    },
  },
}));

const Table: React.FunctionComponent<IProps> = (props) => {
  const { children } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });

  const cls = classNames({
    [classes.table]: true,
  });
  return <table className={cls}>{children}</table>;
};

export default Table;
