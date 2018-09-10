/* @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import { Trans, translate } from 'react-i18next';

import Text from 'components/text';
import { Date, Time } from 'components/i18n';
import Button from 'components/button';

import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell
} from 'components/table';

type Props = {
  electionGroups: Array<ElectionGroup>,
  elections: Object,
  noElectionsText: ReactElement,
  i18n: Object
}

const VoterElectionsTable = (props: Props) => {
  const lang = props.i18n.language;
  const { electionGroups, elections, i18n, noElectionsText } = props;
  return (
    <Table>
      <TableHeader key="thead">
        <TableHeaderRow>
          <TableHeaderCell>
            <Trans>election.election</Trans>
          </TableHeaderCell>
          <TableHeaderCell>
            <Trans>election.opens</Trans>
          </TableHeaderCell>
          <TableHeaderCell>
            <Trans>election.closes</Trans>
          </TableHeaderCell>
          <TableHeaderCell>
            <Trans>election.canVote</Trans>
          </TableHeaderCell>
          <TableHeaderCell />
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {electionGroups.length === 0 &&
          <TableRow>
            <TableCell colspan={5}><Text>{noElectionsText}</Text></TableCell>
          </TableRow>
        }
        {electionGroups.map((group, index) => {
          const election = elections[group.elections[0]];
          const canVote = true;
          const hasVoted = false;
          return (
            <TableRow key={index} tall>
              <TableCell>
                <Text>{group.name[lang]}</Text>
              </TableCell>
              <TableCell>
                <Text><Date date={election.startDate} /></Text>
                <Text size="small"><Time time={election.startTime} /></Text>
              </TableCell>
              <TableCell>
                <Text><Date date={election.endDate} /></Text>
                <Text size="small"><Time time={election.endTime} /></Text>
              </TableCell>
              <TableCell>
                <Text>
                  {canVote ?
                    <Trans>general.yes</Trans> :
                    <Trans>general.no</Trans>
                  }
                </Text>
              </TableCell>
              <TableCell noPadding>
                {!hasVoted ?
                  <Button primary text={<Trans>election.voteNow</Trans>}
                    wide
                    action={() => console.error('NEW VOTE')}
                  /> :
                  <Button secondary text={<Trans>election.changeVote</Trans>}
                    wide
                    action={() => console.error('CHANGE VOTE')}
                  />
                }
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
};

export default translate()(VoterElectionsTable);