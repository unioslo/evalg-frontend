import React from 'react';
import { useTranslation } from 'react-i18next';
import moment, { Moment } from 'moment';
import { Redirect } from 'react-router';

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
import { ElectionGroup } from 'interfaces';

interface IProps {
  electionGroups: Array<ElectionGroup>;
  votingRightsElectionGroups: string[];
  noElectionsText: React.ReactElement;
}

interface RedirectState {
  redirectTo: string;
}

const VoterElectionsTable: React.FunctionComponent<IProps> = (
  props: IProps
) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { electionGroups, noElectionsText } = props;
  const [redirect, setRedirect] = React.useState<RedirectState>({redirectTo: ''});

  const dateTimeToMarkup = (dateTime: Moment | string) => (
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
    redirect.redirectTo ?
      <Redirect push to={redirect.redirectTo} />
    : (
      <Table>
        <TableHeader key="thead">
          <TableHeaderRow>
            <TableHeaderCell>{t('election.election')}</TableHeaderCell>
            <TableHeaderCell>{t('election.opens')}</TableHeaderCell>
            <TableHeaderCell>{t('election.closes')}</TableHeaderCell>
            <TableHeaderCell>{t('election.rightToVote')}</TableHeaderCell>
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
            let startTime: Moment | string;
            let endTime: Moment | string;

            if (group.elections.length === 1) {
              startTime = group.elections[0].start;
              endTime = group.elections[0].end;
            } else {
              startTime = moment.min(
                ...group.elections.map(e => moment(e.start))
              );
              endTime = moment.max(...group.elections.map(e => moment(e.end)));
            }

            let canVote = false;
            if (props.votingRightsElectionGroups.includes(group.id)) {
              canVote = true;
            }

            const hasVoted = false;
            return (
              <TableRow
                key={index}
                tall
                onClick={() => setRedirect({redirectTo: `/vote/${group.id}`}) }
              >
                <TableCell maxWidth="50rem">
                  <Text>{group.name[lang]}</Text>
                </TableCell>
                <TableCell>{dateTimeToMarkup(startTime)}</TableCell>
                <TableCell>{dateTimeToMarkup(endTime)}</TableCell>
                <TableCell alignCenter>
                  {canVote ? (
                    <Text>{t('general.yes')}</Text>
                  ) : (
                    <Text>{t('general.no')}</Text>
                  )}
                </TableCell>
                <TableCell noPadding>
                  {!hasVoted ? (
                    <Link to={`/vote/${group.id}`}>{t('election.voteNow')}</Link>
                  ) : (
                    <Button
                      secondary
                      text={t('election.changeVote')}
                      wide
                      action={() => console.error('CHANGE VOTE')}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    )
  );
};

export default VoterElectionsTable;
