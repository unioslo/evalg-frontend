import * as React from 'react';

import Text from 'components/text'
import { TableRow, TableCell } from 'components/table';
import { Trans } from 'react-i18next';;

// type Props = {
//   colSpan: number
// }

const NoCandidatesRow = (props) => {
  return (
    <TableRow>
      <TableCell colspan={props.colSpan}>
        <Text>
          <Trans>election.noCandidatesDefined</Trans>
        </Text>
      </TableCell>
    </TableRow>
      )
    };

export default NoCandidatesRow;
