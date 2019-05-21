import React from 'react';
import { useTranslation } from 'react-i18next';

import Text from 'components/text';
import { TableRow, TableCell } from 'components/table';
import ElectionStatus from 'components/electionStatus';
import { Date, Time } from 'components/i18n';
import { Election } from 'interfaces';

import VoteStatus from './VoteStatus';

interface IProps {
  election: Election;
}

const ElectionTableRow: React.FunctionComponent<IProps> = (props: IProps) => {
  const { election } = props;
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  return (
    <TableRow>
      <TableCell noBorder />
      <TableCell>
        <Text>{election.name[lang]}</Text>
      </TableCell>
      <TableCell>
        <Text>
          <Date dateTime={election.start} longDate />
        </Text>
        <Text size="small">
          <Time dateTime={election.start} />
        </Text>
      </TableCell>
      <TableCell>
        <Text>
          <Date dateTime={election.end} longDate />
        </Text>
        <Text size="small">
          <Time dateTime={election.end} />
        </Text>
      </TableCell>
      <TableCell>
        <VoteStatus
          totalVotes={election.voteCount.total}
          votesOutsideCensus={election.voteCount.selfAddedNotReviewed}
          preposition={t('general.of')}
        />
      </TableCell>
      <TableCell>
        <ElectionStatus status={election.status} />
      </TableCell>
    </TableRow>
  );
};

export default ElectionTableRow;
