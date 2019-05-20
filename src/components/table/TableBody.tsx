import React from 'react';

interface IProps {
  children?: React.ReactNode;
}

export const TableBody = (props: IProps) => {
  return <tbody>{props.children}</tbody>;
};

export default TableBody;
