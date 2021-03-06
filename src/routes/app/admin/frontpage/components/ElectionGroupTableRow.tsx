import React from 'react';
import { useTranslation } from 'react-i18next';

import { TableRow, TableCell } from 'components/table';
import Text from 'components/text';
import ElectionStatus from 'components/electionStatus';
import DropdownArrowIcon from 'components/icons/DropdownArrowIcon';
import { Date, Time } from 'components/i18n';
import { ElectionGroup } from 'interfaces';
import { allEqual } from 'utils';

import VoteStatus from './VoteStatus';

interface IProps {
  elGrp: ElectionGroup;
  selected?: boolean;
  selectAction: Function;
}

const ElectionGroupTableRow: React.FunctionComponent<IProps> = (
  props: IProps
) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { elGrp } = props;
  let totalVotes = 0;
  let totalVotesOutsideCensus = 0;
  const startTimes: string[] = [];
  const endTimes: string[] = [];
  const statuses: string[] = [];
  const { elections } = elGrp;
  const activeElections = elections.filter((e: any) => e.active);
  const hasActiveElections = activeElections.length > 0;

  activeElections.forEach(e => {
    startTimes.push(e.start);
    endTimes.push(e.end);
    statuses.push(e.status);
    totalVotes += e.voteCount.total;
    totalVotesOutsideCensus += e.voteCount.selfAddedNotReviewed;
  });
  const sharedStartTime = allEqual(startTimes);
  const sharedEndTime = allEqual(endTimes);
  const sharedStatus = allEqual(statuses);

  return (
    <TableRow
      thickBorder={!props.selected}
      onClick={props.selectAction.bind(null, elGrp.id)}
    >
      <TableCell noBorder>
        <DropdownArrowIcon selected={props.selected} />
      </TableCell>
      <TableCell maxWidth="38rem">
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
              <Text>{t('election.multipleTimes')}</Text>
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
              <Text>{t('election.multipleTimes')}</Text>
            </TableCell>
          )}
          <TableCell>
            <VoteStatus
              totalVotes={totalVotes}
              votesOutsideCensus={totalVotesOutsideCensus}
              preposition={t('general.of')}
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
            <em>{t('election.noActiveVoterGroups')}</em>
          </Text>
        </TableCell>
      )}
    </TableRow>
  );
};

export default ElectionGroupTableRow;
