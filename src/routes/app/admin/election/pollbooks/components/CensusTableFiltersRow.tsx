import React, { useState } from 'react';
import i18n from 'i18next';

import { TableRow, TableCell } from 'components/table';
import { DropDown, TextInput } from 'components/form';
import ActionText from 'components/actiontext';

interface IFiltersRowProps {
  idTypeFilter: string;
  pollbookFilter: string;
  idTypeFilterOptions: { name: string; value: string }[];
  pollbookFilterOptions: { name: string; value: string }[];
  onIdTypeFilterChange: (idTypeFilter: string) => void;
  onIdValueFilterChange: (idValueFilter: string) => void;
  onPollbookFilterChange: (idTypeFilter: string) => void;
  onResetFilters: () => void;
  disabled?: boolean;
  t: i18n.TFunction;
}

const CensusTableFiltersRow: React.FunctionComponent<IFiltersRowProps> = ({
  idTypeFilter,
  pollbookFilter,
  idTypeFilterOptions,
  pollbookFilterOptions,
  onIdTypeFilterChange,
  onIdValueFilterChange,
  onPollbookFilterChange,
  onResetFilters,
  disabled,
  t,
}) => {
  const [idValueFilter, setIdValueFilter] = useState('');

  const handleIdValueFilterInputChange = (idValueFilter: string) => {
    setIdValueFilter(idValueFilter);
    onIdValueFilterChange(idValueFilter);
  };

  const handleRemoveFilters = () => {
    setIdValueFilter('');
    onResetFilters();
  };

  const hasActiveFilters =
    (idTypeFilter && idTypeFilter !== 'all') ||
    idValueFilter ||
    (pollbookFilter && pollbookFilter !== 'all');

  return (
    <TableRow>
      <TableCell>
        <DropDown
          options={idTypeFilterOptions}
          onChange={onIdTypeFilterChange}
          placeholder={t('census.idType')}
          disabled={disabled}
          value={idTypeFilter}
        />
      </TableCell>
      <TableCell>
        <TextInput
          onChange={handleIdValueFilterInputChange}
          name={t('census.idValue')}
          placeholder={t('census.idValue')}
          value={idValueFilter}
          disabled={disabled}
          narrow
        />
      </TableCell>
      <TableCell>
        <DropDown
          options={pollbookFilterOptions}
          onChange={onPollbookFilterChange}
          placeholder={t('general.group')}
          disabled={disabled}
          value={pollbookFilter}
          large
        />
      </TableCell>
      {hasActiveFilters ? (
        <TableCell alignRight>
          <ActionText bottom action={handleRemoveFilters}>
            {t('census.resetFilters')}
          </ActionText>
        </TableCell>
      ) : (
        <TableCell />
      )}
    </TableRow>
  );
};

export default CensusTableFiltersRow;
