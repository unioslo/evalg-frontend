import React, { useState } from 'react';
import { ElectionGroup, IVoter, IPollBook, DropDownOption } from 'interfaces';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import Spinner from 'components/animations/Spinner';
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
import { useTranslation } from 'react-i18next';
import {
  TextInput,
  DropDown,
  FormFieldGroup,
  FormField,
} from 'components/form';
import { PageSection } from 'components/page';
import UpdateVoterForm from './UpdateVoterForm';
import { ConfirmModal } from 'components/modal';
import { getPersonIdTypeDisplayName } from 'utils/i18n';

const voterSearchQuery = gql`
  query electionGroupSearchVoters(
    $electionGroupId: UUID!
    $limit: Int
    $search: String
    $hasVoted: Boolean
    $pollbookId: UUID
  ) {
    searchVoters(
      electionGroupId: $electionGroupId
      limit: $limit
      search: $search
      hasVoted: $hasVoted
      pollbookId: $pollbookId
    ) {
      id
      idType
      idValue
      reviewed
      verified
      verifiedStatus
      hasVoted
      pollbookId
      pollbook {
        id
        name
      }
    }
  }
`;

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

const refetchQueries = () => ['electionGroupSearchVoters'];

interface IProps {
  electionGroup: ElectionGroup;
}

const CensusSearchTable: React.FunctionComponent<IProps> = ({
  electionGroup,
}) => {
  const { t, i18n } = useTranslation();
  const [searchString, setSearchString] = useState('');
  const [pollbookFilter, setPollbookFilter] = useState('');
  const [hasVotedFilter, setHasVotedFilter] = useState('');
  const [voterToUpdateId, setVoterToUpdateId] = useState('');
  const [voterToDelete, setVoterToDelete] = useState<null | IVoter>(null);

  const pollbooks: Array<IPollBook> = electionGroup.elections
    .filter((e) => e.active)
    .flatMap((e) => e.pollbooks);

  const pollbookDict = {};
  pollbooks.forEach((p) => (pollbookDict[p.id] = p));

  const pollbookOptions: Array<DropDownOption> = pollbooks.map((p) => {
    return {
      name: p.name[i18n.language],
      value: p.id,
    };
  });

  const pollbookFilterOptions = Object.assign([], pollbookOptions);
  pollbookFilterOptions.push({ name: t('general.all'), value: 'all' });

  const hasVotedFilterOptions: Array<DropDownOption> = [
    { name: t('census.search.hasVoted'), value: 'yes' },
    { name: t('census.search.hasNotVoted'), value: 'no' },
    { name: t('general.all'), value: 'all' },
  ];

  const searchOptions = {
    electionGroupId: electionGroup.id,
    limit: 50,
    search: searchString,
  };

  // Add the hasVoted filter if set.
  if (hasVotedFilter === 'yes') {
    searchOptions['hasVoted'] = true;
  } else if (hasVotedFilter === 'no') {
    searchOptions['hasVoted'] = false;
  }

  if (pollbookFilter !== '' && pollbookFilter !== 'all') {
    searchOptions['pollbookId'] = pollbookFilter;
  }

  const handleShowUpdateVoterForm = (voterId: string) => {
    setVoterToUpdateId(voterId);
  };

  const handleCloseUpdateVoterForm = () => {
    setVoterToUpdateId('');
  };

  const handleShowDeleteVoterModalForVoter = (voter: IVoter) => {
    setVoterToDelete(voter);
  };

  const handleCloseDeleteVoterModal = () => {
    setVoterToDelete(null);
  };

  return (
    <>
      <PageSection header={t('census.search.header')}>
        <FormFieldGroup flex>
          <FormField inline>
            <TextInput
              label={t('census.search.searchFor')}
              onChange={(s: string) => setSearchString(s)}
              name={t('census.search.searchFor')}
              value={searchString}
            />
          </FormField>
          <FormField inline>
            <DropDown
              label={t('census.search.filter.votingStatus')}
              options={hasVotedFilterOptions}
              onChange={(s: string) => setHasVotedFilter(s)}
              placeholder={t('census.search.votingStatus')}
              value={hasVotedFilter}
            />
          </FormField>
          <FormField inline>
            <DropDown
              label={t('census.search.filter.censusGroup')}
              options={pollbookFilterOptions}
              onChange={(s: string) => setPollbookFilter(s)}
              placeholder={t('general.group')}
              value={pollbookFilter}
            />
          </FormField>
        </FormFieldGroup>

        {searchString !== '' ? (
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>{t('census.idType')}</TableHeaderCell>
                <TableHeaderCell>{t('census.idValue')}</TableHeaderCell>
                <TableHeaderCell>
                  {t('census.search.votingStatus')}
                </TableHeaderCell>
                <TableHeaderCell>{t('census.group')}</TableHeaderCell>
                <TableHeaderCell />
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              <Query query={voterSearchQuery} variables={searchOptions}>
                {({ data, loading }: { data: any; loading: any }) => {
                  if (loading) {
                    return (
                      <TableRow>
                        <TableCell colspan={5}>
                          <Text alignCenter>
                            <Spinner
                              size="2.2rem"
                              darkStyle
                              marginRight="1rem"
                            />
                            {t('census.search.searching')}
                          </Text>
                        </TableCell>
                      </TableRow>
                    );
                  }

                  const voters: Array<IVoter> = data.searchVoters;

                  if (voters.length === 0 && searchString !== '') {
                    return (
                      <TableRow>
                        <TableCell colspan={5}>
                          <Text alignCenter>
                            {t('census.search.noResults')}
                          </Text>
                        </TableCell>
                      </TableRow>
                    );
                  }

                  return (
                    <>
                      {voters.map((voter) => {
                        if (voter.id === voterToUpdateId) {
                          return (
                            <TableRow key={voter.id} verticalPadding>
                              <TableCell topPadding verticalAlignTop>
                                <Text>
                                  {getPersonIdTypeDisplayName(voter.idType, t)}
                                </Text>
                              </TableCell>
                              <TableCell topPadding verticalAlignTop>
                                <Text>{voter.idValue}</Text>
                              </TableCell>
                              <TableCell topPadding verticalAlignTop>
                                <Text>
                                  {voter.hasVoted
                                    ? t('general.yes')
                                    : t('general.no')}
                                </Text>
                              </TableCell>
                              <TableCell colspan={2}>
                                <Mutation
                                  mutation={updateVoterPollBook}
                                  refetchQueries={refetchQueries}
                                >
                                  {(updateVoter: any) => {
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
                                        options={pollbookOptions}
                                        deleteAction={() =>
                                          handleShowDeleteVoterModalForVoter(
                                            voter
                                          )
                                        }
                                      />
                                    );
                                  }}
                                </Mutation>
                              </TableCell>
                            </TableRow>
                          );
                        }
                        return (
                          <TableRow key={voter.id} actionTextOnHover>
                            <TableCell>{voter.idType}</TableCell>
                            <TableCell>{voter.idValue}</TableCell>
                            <TableCell>
                              <Text>
                                {voter.hasVoted
                                  ? t('general.yes')
                                  : t('general.no')}
                              </Text>
                            </TableCell>
                            <TableCell>
                              <Text>{voter.pollbook.name[i18n.language]}</Text>
                            </TableCell>
                            <TableCell alignRight>
                              <Text>
                                <ActionText
                                  action={() =>
                                    handleShowUpdateVoterForm(voter.id)
                                  }
                                >
                                  {t('general.edit')}
                                </ActionText>
                              </Text>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  );
                }}
              </Query>
            </TableBody>
          </Table>
        ) : null}

        {voterToDelete && (
          <Mutation mutation={deleteVoter} refetchQueries={refetchQueries}>
            {(del: any) => {
              const deleteAndClose = () => {
                del({ variables: { id: voterToDelete.id } });
                handleCloseDeleteVoterModal();
              };
              return (
                <ConfirmModal
                  confirmAction={deleteAndClose}
                  closeAction={handleCloseDeleteVoterModal}
                  header={t('census.deletePersonConfirmationModalTitle')}
                  body={t('census.deletePersonConfirmationModalText', {
                    idType: getPersonIdTypeDisplayName(
                      voterToDelete.idType,
                      t
                    ).toLowerCase(),
                    idValue: voterToDelete.idValue,
                    pollbookName:
                      pollbookDict[voterToDelete.pollbookId].name[
                        i18n.language
                      ],
                  })}
                  confirmText={t('general.delete')}
                  closeText={t('general.cancel')}
                />
              );
            }}
          </Mutation>
        )}
      </PageSection>
    </>
  );
};

export default CensusSearchTable;
