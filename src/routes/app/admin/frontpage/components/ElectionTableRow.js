/* @flow */
import * as React from 'react';
import { translate, Trans } from 'react-i18next';

import Text from 'components/text';
import { TableRow, TableCell } from 'components/table';

import ElectionStatus from 'components/electionStatus';
import VoteStatus from './VoteStatus';

import { Date, Time } from 'components/i18n';

// type Props = {
//   election: Election,
//   i18n: Object
// };

class ElectionTableRow extends React.Component {
  render() {
    const { election } = this.props;
    const lang = this.props.i18n.language;
    // TODO: Insert proper values from ballot-api when ready
    const totalVotes = 0;
    const votesOutsideCensus = 0;
    return (
      <TableRow>
        <TableCell noBorder />
        <TableCell>
          <Text>
            {election.name[lang]}
          </Text>
        </TableCell>
        <TableCell>
          <Text>
            <Date dateTime={election.start} />
          </Text>
          <Text size="small">
            <Time dateTime={election.start} />
          </Text>
        </TableCell>
        <TableCell>
          <Text>
            <Date dateTime={election.end} />
          </Text>
          <Text size="small">
            <Time dateTime={election.end} />
          </Text>
        </TableCell>
        <TableCell>
          <VoteStatus
            totalVotes={totalVotes}
            votesOutsideCensus={votesOutsideCensus}
            preposition={<Trans>general.of</Trans>}
          />
        </TableCell>
        <TableCell>
          <ElectionStatus status={election.status} />
        </TableCell>
      </TableRow>
    )
  }
}

export default translate()(ElectionTableRow);