import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Trans, TranslationFunction } from 'react-i18next';
import { Field, Form } from 'react-final-form';

import {
  IPollBook,
  IVoter,
  DropDownOption,
} from '../../../../../../interfaces';

import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '../../../../../../components/table';
import AddVoterForm from './AddVoterForm';
import Text from '../../../../../../components/text';
import ActionText from '../../../../../../components/actiontext';
import { getVoterIdTypeDisplayName } from '../../../../../../utils/i18n';
import { FormButtons, DropDownRF } from '../../../../../../components/form';
import { ConfirmModal } from '../../../../../../components/modal';

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

const refetchQueries = () => ['electionGroupVoters'];

interface IUpdateVoterForm {
  submitAction: (o: any) => void;
  closeAction: () => void;
  deleteAction: () => void;
  options: DropDownOption[];
  initialValues: object;
}

const UpdateVoterForm: React.SFC<IUpdateVoterForm> = props => {
  const {
    closeAction,
    deleteAction,
    options,
    submitAction,
    initialValues,
  } = props;

  const renderForm = (formProps: any) => {
    const { handleSubmit, pristine, valid } = formProps;
    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="pollbookId"
          component={DropDownRF as any}
          options={options}
        />
        <FormButtons
          saveAction={handleSubmit}
          closeAction={closeAction}
          submitDisabled={pristine || !valid}
          entityAction={deleteAction}
          entityText={<Trans>census.deleteFromCensus</Trans>}
        />
      </form>
    );
  };
  return (
    <Form
      onSubmit={submitAction}
      initialValues={initialValues}
      render={renderForm}
    />
  );
};

interface IProps {
  pollBooks: IPollBook[];
  addVoterPollbookId: string;
  onCloseAddVoterForm: () => void;
  t: TranslationFunction;
  lang: string;
}

const CensusTable: React.FunctionComponent<IProps> = ({
  pollBooks,
  addVoterPollbookId,
  onCloseAddVoterForm,
  t,
  lang,
}) => {
  const [showNewVoterForm, setShowNewVoterForm] = useState(false);
  const [voterToUpdateId, setVoterToUpdateId] = useState('');
  const [voterToDelete, setVoterToDelete] = useState<null | IVoter>(null);
  const [nRecordsToShow, setNRecordsToShow] = useState(
    N_RECORDS_TO_SHOW_INCREMENT
  );

  useEffect(() => {
    if (addVoterPollbookId) {
      handleCloseUpdateVoterForm();
      setShowNewVoterForm(true);
    }
  }, [addVoterPollbookId]);

  const handleCloseAddVoterForm = () => {
    setShowNewVoterForm(false);
    onCloseAddVoterForm();
  };

  const handleShowUpdateVoterFormForVoterId = (voterId: string) => {
    handleCloseAddVoterForm();
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

  const voters: IVoter[] = [];
  const pollBookDict: { [pollbookId: string]: IPollBook } = {};
  const pollBookOptions: DropDownOption[] = [];

  pollBooks.forEach(pollBook => {
    pollBookDict[pollBook.id] = pollBook;
    pollBook.voters
      .filter(voter => voter.verified)
      .forEach(voter => {
        voters.push(voter);
      });
    pollBookOptions.push({
      name: pollBook.name[lang],
      value: pollBook.id,
    });
  });

  const filteredVoters = [...voters];
  const filteredVotersToShow = filteredVoters.slice(0, nRecordsToShow);

  const nRecordsShowing = Math.min(nRecordsToShow, filteredVoters.length);
  const nMoreRecordsToShowOnNextIncrease = Math.min(
    N_RECORDS_TO_SHOW_INCREMENT,
    filteredVoters.length - nRecordsToShow
  );

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
          {showNewVoterForm && !!addVoterPollbookId && (
            <AddVoterForm
              pollbook={pollBookDict[addVoterPollbookId]}
              onClose={handleCloseAddVoterForm}
              t={t}
              lang={lang}
            />
          )}

          {filteredVotersToShow.map(voter => {
            if (voter.id === voterToUpdateId) {
              return (
                <React.Fragment key={voter.id}>
                  <TableRow verticalPadding={true}>
                    <TableCell topPadding verticalAlignTop>
                      <Text>{getVoterIdTypeDisplayName(voter.idType, t)}</Text>
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
                    <Text>{getVoterIdTypeDisplayName(voter.idType, t)}</Text>
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
                      idType: getVoterIdTypeDisplayName(
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
