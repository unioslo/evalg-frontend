/* @flow */
import * as React from 'react';
import { Trans, translate } from 'react-i18next';
import moment from 'moment';

import Text from 'components/text';
import { Date, Time } from 'components/i18n';
import Button from 'components/button';
import Link from 'components/link';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from 'components/table';
import { allEqualForAttrs } from 'utils';

type Props = {
  electionGroups: Array<ElectionGroup>,
  noElectionsText: ReactElement,
  i18n: Object,
};

const VoterElectionsTable = (props: Props) => {
  const lang = props.i18n.language;
  const { electionGroups, i18n, noElectionsText } = props;

  const dateTimeToMarkup = dateTime => (
    <React.Fragment>
      <Text>
        <Date dateTime={dateTime} longDate />
      </Text>
      <Text size="small">
        <Time dateTime={dateTime} />
      </Text>
    </React.Fragment>
  );

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
            <Trans>election.rightToVote</Trans>
          </TableHeaderCell>
          <TableHeaderCell />
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {electionGroups.length === 0 && (
          <TableRow>
            <TableCell colspan={5}>
              <Text>{noElectionsText}</Text>
            </TableCell>
          </TableRow>
        )}
        {electionGroups.map((group, index) => {
          let startTime;
          let endTime;

          if (group.elections.length === 1) {
            startTime = group.elections[0].start;
            endTime = group.elections[0].end;
          } else {
            startTime = moment.min(
              ...group.elections.map(e => moment(e.start))
            );
            endTime = moment.max(...group.elections.map(e => moment(e.end)));
          }

          const canVote = true;
          const hasVoted = false;
          return (
            <TableRow key={index} tall>
              <TableCell>
                <Text>{group.name[lang]}</Text>
              </TableCell>
              <TableCell>{dateTimeToMarkup(startTime)}</TableCell>
              <TableCell>{dateTimeToMarkup(endTime)}</TableCell>
              <TableCell alignCenter={true}>
                <Text>
                  {canVote ? (
                    <Trans>general.yes</Trans>
                  ) : (
                    <Trans>general.no</Trans>
                  )}
                </Text>
              </TableCell>
              <TableCell noPadding>
                {!hasVoted ? (
                  <Link
                    to={`/voter/election-groups/${
                      group.id
                    }/select-voting-group`}
                  >
                    <Trans>election.voteNow</Trans>
                  </Link>
                ) : (
                  <Button
                    secondary={true}
                    text={<Trans>election.changeVote</Trans>}
                    wide={true}
                    action={() => console.error('CHANGE VOTE')}
                  />
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default translate()(VoterElectionsTable);
