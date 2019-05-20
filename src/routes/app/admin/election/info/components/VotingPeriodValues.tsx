import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Time, Date } from '../../../../../../components/i18n';
import Text from '../../../../../../components/text';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from '../../../../../../components/table';

import { InfoList, InfoListItem } from '../../../../../../components/infolist';
import { allEqualForAttrs } from '../../../../../../utils';
import { ElectionGroup, Election } from '../../../../../../interfaces';

interface IVotingPeriodProps {
  elections: any[];
  lang: string;
}

const MultipleVotingPeriods: React.SFC<IVotingPeriodProps> = (
  props: IVotingPeriodProps
) => {
  const { elections, lang } = props;

  const makeTableRow = (
    votingGroupName: any,
    startDateTime: any,
    endDateTime: any,
    key = 0
  ) => (
    <TableRow key={key}>
      <TableCell>
        <Text>{votingGroupName}</Text>
      </TableCell>
      <TableCell>
        <Text>
          <Date dateTime={startDateTime} longDate />
        </Text>
        <Text size="small">
          <Time dateTime={startDateTime} />
        </Text>
      </TableCell>
      <TableCell>
        <Text>
          <Date dateTime={endDateTime} longDate />
        </Text>
        <Text size="small">
          <Time dateTime={endDateTime} />
        </Text>
      </TableCell>
    </TableRow>
  );

  const tableRows =
    elections.length > 1 && allEqualForAttrs(elections, ['start', 'end'])
      ? [
          makeTableRow(
            <em>
              <Trans>election.allVotingGroups</Trans>
            </em>,
            elections[0].start,
            elections[0].end
          ),
        ]
      : elections.map((e: any, index: any) =>
          makeTableRow(e.name[lang], e.start, e.end, index)
        );

  return (
    <Table>
      <TableHeader>
        <TableHeaderRow>
          <TableHeaderCell>
            <Trans>election.voterGroup</Trans>
          </TableHeaderCell>
          <TableHeaderCell>
            <Trans>election.electionOpens</Trans>
          </TableHeaderCell>
          <TableHeaderCell>
            <Trans>election.electionCloses</Trans>
          </TableHeaderCell>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>{tableRows}</TableBody>
    </Table>
  );
};

const SingleVotingPeriod: React.SFC<IVotingPeriodProps> = (
  props: IVotingPeriodProps
) => {
  const { elections } = props;
  return (
    <InfoList>
      <InfoListItem>
        <Trans>election.electionOpens</Trans>:&nbsp;
        <Text bold inline>
          <Date dateTime={elections[0].start} longDate />{' '}
          <Time dateTime={elections[0].start} />
        </Text>
      </InfoListItem>
      <InfoListItem>
        <Trans>election.electionCloses</Trans>:&nbsp;
        <Text bold inline>
          <Date dateTime={elections[0].end} longDate />{' '}
          <Time dateTime={elections[0].end} />
        </Text>
      </InfoListItem>
    </InfoList>
  );
};

const NoActiveElections: React.SFC<IVotingPeriodProps> = (
  props: IVotingPeriodProps
) => {
  return (
    <p>
      <Trans>election.noActiveElections</Trans>
    </p>
  );
};

const getVotingInfoComponent = (grpType: string, elections: Election[]) => {
  if (elections.length === 0) {
    return NoActiveElections;
  } else if (grpType === 'multiple_elections') {
    return MultipleVotingPeriods;
  }
  return SingleVotingPeriod;
};

interface IProps {
  electionGroup: ElectionGroup;
  activeElections: Election[];
}

const VotingPeriodValues: React.FunctionComponent<IProps> = (props: IProps) => {
  const { i18n } = useTranslation();

  const { electionGroup: grp, activeElections } = props;
  const VotingTimes = getVotingInfoComponent(grp.type, activeElections);
  return <VotingTimes elections={activeElections} lang={i18n.language} />;
};

export default VotingPeriodValues;
