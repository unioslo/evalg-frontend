import * as React from 'react';
import { Trans, translate } from 'react-i18next';
import { i18n } from 'i18next';

import { TableRow, TableCell } from '../../../../../components/table';
import Text from '../../../../../components/text';
import VoteStatus from './VoteStatus';
import ElectionStatus from '../../../../../components/electionStatus';
import DropdownArrowIcon from '../../../../../components/icons/DropdownArrowIcon';
import { ElectionGroup } from '../../../../../interfaces';

import { Date, Time } from '../../../../../components/i18n';
import { allEqual } from '../../../../../utils';

interface IProps {
  elGrp: ElectionGroup;
  selected?: boolean;
  selectAction: Function;
  i18n: i18n;
}

class ElectionGroupTableRow extends React.Component<IProps> {
  render() {
    const lang = this.props.i18n.language;
    const { elGrp } = this.props;
    let totalVotes = 0;
    let totalVotesOutsideCensus = 0;
    const startTimes: string[] = [];
    const endTimes: string[] = [];
    const statuses: string[] = [];
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
        <TableCell  maxWidth='38rem'>
          <Text bold>{elGrp.name[lang]}</Text>
        </TableCell>
        {hasActiveElections ? (
          <React.Fragment>
            {sharedStartTime ? (
              <TableCell>
                <Text>
                  <Date dateTime={activeElections[0].start} longDate />
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
                  <Date dateTime={activeElections[0].end} longDate />
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

export default translate()(ElectionGroupTableRow);
