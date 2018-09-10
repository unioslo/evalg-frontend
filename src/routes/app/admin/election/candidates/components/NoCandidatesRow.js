/* @flow */
import * as React from 'react';

import Text from 'components/text'
import { Trans } from 'react-i18next';;
import {
  TableRow,
  TableCell
} from 'components/table';

type Props = {
  colSpan: number
}

const NoCandidatesRow = (props: Props) => {
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