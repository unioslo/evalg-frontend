import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import debounce from 'lodash/debounce';
import { Trans } from 'react-i18next';
import i18n from 'i18next';

import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from 'components/table';
import Text from 'components/text';
import ActionText from 'components/actiontext';
import { getPersonIdTypeDisplayName } from 'utils/i18n';
import { ConfirmModal } from 'components/modal';
import { IPollBook, IVoter, DropDownOption, PersonIdType } from 'interfaces';

import CensusTableFiltersRow from './CensusTableFiltersRow';
import AddVoterForm from './AddVoterForm';
import UpdateVoterForm from './UpdateVoterForm';

const N_RECORDS_TO_SHOW_INCREMENT = 50;

const updateVoterPollBook = gql`
  mutation UpdateVoterPollBook($id: UUID!, $pollbookId: UUID!) {
    updateVoterPollbook(id: $id, pollbookId: $pollbookId) {
      ok
    }
  }
`;

const deleteVoter = gql`
  mutation DeleteVoter($id: UUID!) {
    deleteVoter(id: $id) {
      ok
    }
  }
`;

const handleIdValueFilterChangeDebounced = debounce(
  (idValueFilter: string, filters, setFilters) => {
    setFilters(Object.assign({}, filters, { idValueFilter }));
  },
  200,
  { trailing: true }
);

const refetchQueries = () => ['electionGroupVoters'];

interface IProps {
  pollBooks: IPollBook[];
  pollBookDict: { [pollbookId: string]: IPollBook };
  pollBookOptions: DropDownOption[];
  voters: IVoter[];
  addVoterPollbookId: string;
  onCloseAddVoterForm: () => void;
  t: i18n.TFunction;
  lang: string;
}

const CensusTable: React.FunctionComponent<IProps> = ({
  pollBooks,
  pollBookDict,
  pollBookOptions,
  voters,
  addVoterPollbookId,
  onCloseAddVoterForm,
  t,
  lang,
}) => {
  // const [showNewVoterForm, setShowNewVoterForm] = useState(false);
  const [voterToUpdateId, setVoterToUpdateId] = useState('');
  const [voterToDelete, setVoterToDelete] = useState<null | IVoter>(null);
  const [nRecordsToShow, setNRecordsToShow] = useState(
    N_RECORDS_TO_SHOW_INCREMENT
  );
  const [filters, setFilters] = useState({
    idTypeFilter: '',
    idValueFilter: '',
    pollbookFilter: '',
  });

  useEffect(() => {
    if (addVoterPollbookId) {
      handleCloseUpdateVoterForm();
    }
  }, [addVoterPollbookId]);

  const handleShowUpdateVoterFormForVoterId = (voterId: string) => {
    onCloseAddVoterForm();
    setVoterToUpdateId(voterId);
  };

  const handleCloseUpdateVoterForm = () => {
    setVoterToUpdateId('');
  };

  const handleShowDeleteVoterModalForVoter = (voter: IVoter) => {
    setVoterToDelete(voter);
  };

  const handleHideDeleteVoterModal = () => {
    setVoterToDelete(null);
  };

  const handleIncreaseNRecordsToShow = () => {
    setNRecordsToShow(nRecordsToShow + N_RECORDS_TO_SHOW_INCREMENT);
  };

  const resetNRecordsToShow = () => {
    setNRecordsToShow(N_RECORDS_TO_SHOW_INCREMENT);
  };

  const handleIdTypeFilterChange = (idTypeFilter: string) => {
    setFilters(Object.assign({}, filters, { idTypeFilter }));
    resetNRecordsToShow();
  };

  const handleIdValueFilterChange = (idValueFilter: string) => {
    handleIdValueFilterChangeDebounced(idValueFilter, filters, setFilters);
    resetNRecordsToShow();
  };

  const handlePollbookFilterChange = (pollbookFilter: string) => {
    setFilters(Object.assign({}, filters, { pollbookFilter }));
    resetNRecordsToShow();
  };

  const handleResetFilters = () => {
    setFilters({ idTypeFilter: '', idValueFilter: '', pollbookFilter: '' });
  };

  const unfilteredVoters = voters;

  const filteredVoters = unfilteredVoters.filter(voter => {
    if (
      filters.idTypeFilter &&
      filters.idTypeFilter !== 'all' &&
      voter.idType !== filters.idTypeFilter
    ) {
      return false;
    }
    if (
      filters.idValueFilter &&
      !voter.idValue.toLowerCase().includes(filters.idValueFilter.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.pollbookFilter &&
      filters.pollbookFilter !== 'all' &&
      voter.pollbookId !== filters.pollbookFilter
    ) {
      return false;
    }
    return true;
  });
  const filteredVotersToShow = filteredVoters.slice(0, nRecordsToShow);

  const nRecordsShowing = Math.min(nRecordsToShow, filteredVoters.length);
  const nMoreRecordsToShowOnNextIncrease = Math.min(
    N_RECORDS_TO_SHOW_INCREMENT,
    filteredVoters.length - nRecordsToShow
  );

  const pollbookFilterOptions = [];
  pollbookFilterOptions.push({ name: t('general.all'), value: 'all' });
  Object.keys(pollBookDict).forEach(id => {
    pollbookFilterOptions.push({
      name: pollBookDict[id].name[lang],
      value: id,
    });
  });

  const idTypes: PersonIdType[] = [];
  const idTypeFilterOptions: { name: string; value: string }[] = [];
  for (const voter of unfilteredVoters) {
    if (!idTypes.includes(voter.idType)) {
      idTypes.push(voter.idType);
    }
  }
  idTypeFilterOptions.push({ name: t('general.all'), value: 'all' });
  for (const idType of idTypes) {
    idTypeFilterOptions.push({
      name: getPersonIdTypeDisplayName(idType, t),
      value: idType,
    });
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell>
              <Trans>census.idType</Trans>
            </TableHeaderCell>
            <TableHeaderCell>
              <Trans>census.idValue</Trans>
            </TableHeaderCell>
            <TableHeaderCell>
              <Trans>census.group</Trans>
            </TableHeaderCell>
            <TableHeaderCell />
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {unfilteredVoters.length > 0 && (
            <CensusTableFiltersRow
              idTypeFilter={filters.idTypeFilter}
              pollbookFilter={filters.pollbookFilter}
              idTypeFilterOptions={idTypeFilterOptions}
              pollbookFilterOptions={pollbookFilterOptions}
              onIdTypeFilterChange={handleIdTypeFilterChange}
              onIdValueFilterChange={handleIdValueFilterChange}
              onPollbookFilterChange={handlePollbookFilterChange}
              onResetFilters={handleResetFilters}
              disabled={!!addVoterPollbookId}
              t={t}
            />
          )}

          {!!addVoterPollbookId && (
            <AddVoterForm
              pollbook={pollBookDict[addVoterPollbookId]}
              onClose={onCloseAddVoterForm}
            />
          )}

          {filteredVotersToShow.map(voter => {
            if (voter.id === voterToUpdateId) {
              return (
                <React.Fragment key={voter.id}>
                  <TableRow verticalPadding={true}>
                    <TableCell topPadding verticalAlignTop>
                      <Text>{getPersonIdTypeDisplayName(voter.idType, t)}</Text>
                    </TableCell>
                    <TableCell topPadding verticalAlignTop>
                      <Text>{voter.idValue}</Text>
                    </TableCell>
                    <TableCell colspan={2}>
                      <Mutation
                        mutation={updateVoterPollBook}
                        refetchQueries={refetchQueries}
                      >
                        {updateVoter => {
                          const update = (values: {
                            id: string;
                            pollbookId: string;
                          }) => {
                            updateVoter({ variables: values });
                            handleCloseUpdateVoterForm();
                          };
                          return (
                            <UpdateVoterForm
                              initialValues={{
                                pollbookId: voter.pollbookId,
                                id: voter.id,
                              }}
                              submitAction={update}
                              closeAction={handleCloseUpdateVoterForm}
                              options={pollBookOptions}
                              deleteAction={() =>
                                handleShowDeleteVoterModalForVoter(voter)
                              }
                            />
                          );
                        }}
                      </Mutation>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            } else {
              return (
                <TableRow key={voter.id} actionTextOnHover>
                  <TableCell>
                    <Text>{getPersonIdTypeDisplayName(voter.idType, t)}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{voter.idValue}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{pollBookDict[voter.pollbookId].name[lang]}</Text>
                  </TableCell>
                  <TableCell alignRight>
                    <Text>
                      <ActionText
                        action={() =>
                          handleShowUpdateVoterFormForVoterId(voter.id)
                        }
                      >
                        <Trans>general.edit</Trans>
                      </ActionText>
                    </Text>
                  </TableCell>
                </TableRow>
              );
            }
          })}
          <TableRow>
            <TableCell colspan={4}>
              {t('census.showingNOfNRecords', {
                nRecordsShowing,
                nRecordsTotal: filteredVoters.length,
              })}{' '}
              {nMoreRecordsToShowOnNextIncrease > 0 && (
                <ActionText bottom action={handleIncreaseNRecordsToShow}>
                  {t('census.showMoreRecordsPrompt', {
                    nMoreRecordsToShow: nMoreRecordsToShowOnNextIncrease,
                  })}
                </ActionText>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {voterToDelete && (
        <Mutation mutation={deleteVoter} refetchQueries={refetchQueries}>
          {del => {
            const deleteAndClose = () => {
              del({ variables: { id: voterToDelete.id } });
              handleHideDeleteVoterModal();
            };
            return (
              <ConfirmModal
                confirmAction={deleteAndClose}
                closeAction={handleHideDeleteVoterModal}
                header={
                  <Trans>census.deletePersonConfirmationModalTitle</Trans>
                }
                body={
                  <Trans
                    values={{
                      idType: getPersonIdTypeDisplayName(
                        voterToDelete.idType,
                        t
                      ).toLowerCase(),
                      idValue: voterToDelete.idValue,
                      pollbookName:
                        pollBookDict[voterToDelete.pollbookId].name[lang],
                    }}
                  >
                    census.deletePersonConfirmationModalText
                  </Trans>
                }
                confirmText={<Trans>general.delete</Trans>}
                closeText={<Trans>general.cancel</Trans>}
              />
            );
          }}
        </Mutation>
      )}
    </>
  );
};

export default CensusTable;
