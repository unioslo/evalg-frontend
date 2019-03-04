/* @flow */
import * as React from 'react';
import { Trans, translate } from 'react-i18next';

import TableRow from 'components/table/TableRow';
import TableCell from 'components/table/TableCell';
import Text from 'components/text';
import VoteStatus from './VoteStatus';
import ElectionStatus from 'components/electionStatus';
import DropdownArrowIcon from 'components/icons/DropdownArrowIcon';

import { Date, Time } from 'components/i18n';

import { allEqual } from 'utils';

// type Props = {
//   elGrp: ElectionGroup,
//   selected?: boolean,
//   selectAction: Function,
//   i18n: Object,
// };

class ElGrpTableRow extends React.Component {
  render() {
    const lang = this.props.i18n.language;
    const { elGrp } = this.props;
    let totalVotes = 0;
    let totalVotesOutsideCensus = 0;
    const startTimes = [];
    const endTimes = [];
    const statuses = [];
    const { elections } = elGrp;
    const activeElections = elections.filter(e => e.active);
    const hasActiveElections = activeElections.length > 0;

    activeElections.forEach(e => {
      startTimes.push(e.start);
      endTimes.push(e.end);
      statuses.push(e.status);
      // TODO: Fetch votes from ballot API when ready
      totalVotes = 0;
      totalVotesOutsideCensus = 0;
    });
    const sharedStartTime = allEqual(startTimes);
    const sharedEndTime = allEqual(endTimes);
    const sharedStatus = allEqual(statuses);

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
        {hasActiveElections ? (
          <React.Fragment>
            {sharedStartTime ? (
              <TableCell>
                <Text>
                  <Date dateTime={activeElections[0].start} />
                </Text>
                <Text size="small">
                  <Time dateTime={activeElections[0].start} />
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
                  <Date dateTime={activeElections[0].end} />
                </Text>
                <Text size="small">
                  <Time dateTime={activeElections[0].end} />
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
                <ElectionStatus status={activeElections[0].status} />
              ) : (
                <ElectionStatus status="multipleStatuses" />
              )}
            </TableCell>
          </React.Fragment>
        ) : (
          <TableCell colspan={4} alignCenter>
            <Text>
              <em>
                <Trans>election.noActiveVoterGroups</Trans>
              </em>
            </Text>
          </TableCell>
        )}
      </TableRow>
    );
  }
}

export default translate()(ElGrpTableRow);
