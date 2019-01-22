/* @flow */
import * as React from 'react';
import {translate, Trans} from 'react-i18next';

import { getDate, getTime } from 'components/i18n';
import Text from 'components/text';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableRow
} from 'components/table';

import { InfoList, InfoListItem } from 'components/infolist';

const MultipleVotingPeriods = (props) => {
  const { elections, lang } = props;
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
      <TableBody>
        {elections.map((e, index) => {
          return (
            <TableRow key={index}>
              <TableCell>
                <Text>
                  {e.name[lang]}
                </Text>
              </TableCell>
              <TableCell>
                <Text>
                  { getDate(e.start) }
                </Text>
                <Text size="small">
                  { getTime(e.start) }
                </Text>
              </TableCell>
              <TableCell>
                <Text>
                  { getDate(e.end) }
                </Text>
                <Text size="small">
                  { getTime(e.end) }
                </Text>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
};

const SingleVotingPeriod = (props) => {
  const { elections } = props;
  return (
    <InfoList>
      <InfoListItem>
        <Trans>election.electionOpens</Trans>:&nbsp;
        <Text bold inline>
          { getDate(elections[0].start) } { getTime(elections[0].start) }
        </Text>
      </InfoListItem>
      <InfoListItem>
        <Trans>election.electionCloses</Trans>:&nbsp;
        <Text bold inline>
          { getDate(elections[0].end) } { getTime(elections[0].end) }
        </Text>
      </InfoListItem>
    </InfoList>
  )
};

const NoActiveElections = () => {
  return <p><Trans>election.noActiveElections</Trans></p>;
};

const getVotingInfoComponent = (grpType, elections) => {
  if (elections.length === 0) {
    return NoActiveElections;
  }
  else if (grpType === 'multiple_elections') {
    return MultipleVotingPeriods;
  }
  return SingleVotingPeriod;
};

type Props = {
  electionGroup: ElectionGroup,
  activeElections: Election[],
  i18n: Object
}

const VotingPeriodValues = (props: Props) => {
  const { electionGroup: grp, activeElections } = props;
  const VotingTimes = getVotingInfoComponent(grp.type, activeElections);
  return (
    <VotingTimes elections={ activeElections } lang={props.i18n.language} />
  )
};

export default translate()(VotingPeriodValues);