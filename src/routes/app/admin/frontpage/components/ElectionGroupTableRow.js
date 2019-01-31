/* @flow */
import * as React from 'react';
import { Trans, translate } from 'react-i18next';

import TableRow from 'components/table/TableRow';
import TableCell from 'components/table/TableCell';
import Text from 'components/text';
import VoteStatus from './VoteStatus';
import ElectionStatus from 'components/electionStatus';
import DropdownArrowIcon from './DropdownArrowIcon';

import { Date, Time } from 'components/i18n';

import { equalValues } from 'utils';

type Props = {
  elGrp: ElectionGroup,
  selected?: boolean,
  selectAction: Function,
  i18n: Object,
};

class ElGrpTableRow extends React.Component<Props> {
  render() {
    const { elGrp } = this.props;
    let totalVotes = 0;
    let totalVotesOutsideCensus = 0;
    const start = [];
    const end = [];
    const electionStatuses = [];
    const { elections } = elGrp;
    // TODO: Fetch votes from ballot API when ready
    elections.forEach(el => {
      start.push(el.start);
      end.push(el.end);
      electionStatuses.push(el.status);
      totalVotes = 0;
      totalVotesOutsideCensus = 0;
    });
    const lang = this.props.i18n.language;
    const sharedStartTime = equalValues(elections, ['startDate', 'startTime']);
    const sharedEndTime = equalValues(elections, ['endDate', 'endTime']);
    const sharedStatus = equalValues(elections, ['status']);
    return (
      <TableRow
        thickBorder={!this.props.selected}
        onClick={this.props.selectAction.bind(null, elGrp.id)}
      >
        <TableCell noBorder>
          <DropdownArrowIcon selected={this.props.selected} />
        </TableCell>
        <TableCell>
          <Text bold>{elGrp.name[lang]}</Text>
        </TableCell>
        {sharedStartTime ? (
          <TableCell>
            <Text>
              <Date dateTime={elections[0].start} />
            </Text>
            <Text size="small">
              <Time dateTime={elections[0].start} />
            </Text>
          </TableCell>
        ) : (
          <TableCell>
            <Text>
              <Trans>election.multipleTimes</Trans>
            </Text>
          </TableCell>
        )}
        {sharedEndTime ? (
          <TableCell>
            <Text>
              <Date dateTime={elections[0].end} />
            </Text>
            <Text size="small">
              <Time dateTime={elections[0].end} />
            </Text>
          </TableCell>
        ) : (
          <TableCell>
            <Text>
              <Trans>election.multipleTimes</Trans>
            </Text>
          </TableCell>
        )}
        <TableCell>
          <VoteStatus
            totalVotes={totalVotes}
            votesOutsideCensus={totalVotesOutsideCensus}
            preposition={<Trans>general.of</Trans>}
          />
        </TableCell>
        <TableCell>
          {sharedStatus ? (
            <ElectionStatus status={elections[0].status} />
          ) : (
            <ElectionStatus status="multipleStatuses" />
          )}
        </TableCell>
      </TableRow>
    );
  }
}

export default translate()(ElGrpTableRow);
