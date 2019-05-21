import React from 'react';

import Text from 'components/text';
import { TableRow, TableCell } from 'components/table';

interface IProps {
  colSpan: number;
  children?: React.ReactNode;
}

const TableRowWithText: React.FunctionComponent<IProps> = (props: IProps) => {
  return (
    <TableRow>
      <TableCell colspan={props.colSpan}>
        <Text>{props.children}</Text>
      </TableCell>
    </TableRow>
  );
};

export default TableRowWithText;
