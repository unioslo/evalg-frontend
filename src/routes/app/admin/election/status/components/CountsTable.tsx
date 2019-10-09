import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import CountDetails from './CountDetails';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from 'components/table';
import DropdownArrowIcon from 'components/icons/DropdownArrowIcon';
import { Date, Time } from 'components/i18n';
import { ElectionGroupCount } from 'interfaces';
import { idValueForPerson } from 'utils/processGraphQLData';

interface IProps {
  electionGroupCounts: ElectionGroupCount[];
}

const CountsTable: React.FunctionComponent<IProps> = ({
  electionGroupCounts,
}) => {
  const { t } = useTranslation();
  const [selectedCountId, setSelectedCountId] = useState('');

  const handleToggleCount = useCallback(
    (countId: string) => {
      if (selectedCountId === countId) {
        setSelectedCountId('');
      } else {
        setSelectedCountId(countId);
      }
    },
    [selectedCountId]
  );

  // Latest count first
  electionGroupCounts.sort((a, b) =>
    moment(a.initiatedAt).isAfter(moment(b.initiatedAt)) ? -1 : 1
  );

  return (
    <Table marginTop="3rem">
      <TableHeader>
        <TableHeaderRow>
          <TableHeaderCell width="8%" />
          <TableHeaderCell width="31%">
            {t('admin.countingSection.countingsSubsection.startedBy')}
          </TableHeaderCell>
          <TableHeaderCell width="31%">
            {t('admin.countingSection.countingsSubsection.timeStarted')}
          </TableHeaderCell>
          <TableHeaderCell width="31">
            {t('admin.countingSection.countingsSubsection.status')}
          </TableHeaderCell>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {electionGroupCounts.map(count => {
          const isSelected = count.id === selectedCountId;

          return (
            <React.Fragment key={count.id}>
              <TableRow
                onClick={() => handleToggleCount(count.id)}
                noBorderBottom={isSelected}
              >
                <TableCell>
                  <DropdownArrowIcon selected={isSelected} />
                </TableCell>
                <TableCell>{idValueForPerson(count.initiatedBy)}</TableCell>
                <TableCell>
                  <Date dateTime={count.initiatedAt} longDate />{' '}
                  <Time dateTime={count.initiatedAt} />
                </TableCell>
                {(count.status === 'finished') ?
                  <TableCell>
                    {t('admin.countingSection.countingsSubsection.finished')}
                  </TableCell>
                  :
                  <TableCell>
                    {t('admin.countingSection.countingsSubsection.ongoing')}
                  </TableCell>
                }
              </TableRow>
              {isSelected && (
                <TableRow>
                  <TableCell />
                  <TableCell colspan={3}>
                    <CountDetails electionGroupCount={count} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default CountsTable;
