import React, { useState, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import CountDetails from './CountDetails';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '../../../../../../components/table';
import DropdownArrowIcon from '../../../../../../components/icons/DropdownArrowIcon';
import { Date, Time } from '../../../../../../components/i18n';
import { ElectionGroupCount } from '../../../../../../interfaces';

interface IProps {
  electionGroupCounts: ElectionGroupCount[];
}

const CountsTable: React.FunctionComponent<IProps> = ({ electionGroupCounts }) => {
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

  return (
    <Table marginTop="3rem">
      <TableHeader>
        <TableHeaderRow>
          <TableHeaderCell width="8%" />
          <TableHeaderCell width="31%">
            <Trans>{t('Startet av')}</Trans>
          </TableHeaderCell>
          <TableHeaderCell width="31%">
            <Trans>{t('Tidspunkt startet')}</Trans>
          </TableHeaderCell>
          <TableHeaderCell width="31">
            <Trans>{t('Status')}</Trans>
          </TableHeaderCell>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {electionGroupCounts.map((count: any) => {
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
                <TableCell>?</TableCell>
                <TableCell>
                  <Date dateTime={count.initiatedAt} longDate />{' '}
                  <Time dateTime={count.initiatedAt} />
                </TableCell>
                <TableCell>{count.status}</TableCell>
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
