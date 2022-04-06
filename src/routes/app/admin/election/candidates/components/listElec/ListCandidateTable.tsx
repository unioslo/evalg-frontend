import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import ActionItem from 'components/actionitem';
import ActionText from 'components/actiontext';
import Icon from 'components/icon';
import { MsgBox } from 'components/msgbox';

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
import { Candidate, ElectionList } from 'interfaces';

import {
  addListElecCandidate,
  AddListElecCandidateData,
  AddListElecCandidateVars,
  deleteCandidate,
  DeleteCandidateData,
  DeleteCandidateVars,
  updateListElecCandidate,
  UpdateListElecCandidateData,
  UpdateListElecCandidateVars,
} from './mutations';

import ListCandidateForm from './ListCandidateForm';

type ListCandidateTableProps = {
  electionList: ElectionList;
};

export default function ListCandidateTable(props: ListCandidateTableProps) {
  const { t } = useTranslation();
  const { electionList } = props;
  const [displayNewCandidateForm, setDisplayNewCandidateForm] =
    useState<boolean>(false);
  const [editCandidateId, setEditCandidateId] = useState<string>('');
  const [candidateAddUpdateMsg, setCandidateAddEditMsg] = useState<string>('');
  const [candidateErrorMsg, setCandidateErrorMsg] = useState<string>('');

  useEffect(() => {
    setCandidateAddEditMsg('');
    setCandidateErrorMsg('');
  }, []);

  const [addCand] = useMutation<
    AddListElecCandidateData,
    AddListElecCandidateVars
  >(addListElecCandidate, {
    refetchQueries: ['electionGroup'],
  });

  const [deleteCand] = useMutation<DeleteCandidateData, DeleteCandidateVars>(
    deleteCandidate,
    {
      refetchQueries: ['electionGroup'],
    }
  );

  const [updateCand] = useMutation<
    UpdateListElecCandidateData,
    UpdateListElecCandidateVars
  >(updateListElecCandidate, {
    refetchQueries: ['electionGroup'],
  });

  const electionIsLocked = electionList.election.isLocked;

  const onAdd = (values: AddListElecCandidateVars) => {
    values.listId = electionList.id;
    addCand({
      variables: { ...values },
      onCompleted: () => {
        setCandidateAddEditMsg(
          t('admin.listElec.candidates.added', {
            name: values.name,
          })
        );
      },
      onError: (err: any) => {
        setCandidateErrorMsg(err);
      },
    });
    setDisplayNewCandidateForm(false);
  };

  const onDelete = (candidate: Candidate) => {
    const candidateName = candidate.name;
    deleteCand({
      variables: { id: candidate.id },
      onCompleted: () => {
        setCandidateAddEditMsg(
          t('admin.listElec.candidates.deleted', {
            name: candidateName,
          })
        );
      },
      onError: (err: any) => {
        setCandidateErrorMsg(err);
      },
    });
    setEditCandidateId('');
  };

  const onUpdate = (values: UpdateListElecCandidateVars) => {
    updateCand({
      variables: { ...values },
      onCompleted: () => {
        setCandidateAddEditMsg(
          t('admin.listElec.candidates.update', {
            name: values.name,
          })
        );
      },
      onError: (err: any) => {
        setCandidateErrorMsg(err);
      },
    });
    setEditCandidateId('');
  };

  const sortedCandidates = electionList.candidates.sort(
    (a: Candidate, b: Candidate) => (a.priority > b.priority ? 1 : -1)
  );

  return (
    <>
      {candidateErrorMsg && (
        <div style={{ marginBottom: '2rem' }}>
          <MsgBox msg={candidateErrorMsg} timeout={false} warning />
        </div>
      )}
      {candidateAddUpdateMsg && (
        <div style={{ marginBottom: '2rem' }}>
          <MsgBox msg={candidateAddUpdateMsg} timeout={false} />
        </div>
      )}
      <Table>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell>
              {t('admin.listElec.candidateTable.placement')}
            </TableHeaderCell>
            <TableHeaderCell>
              {t('admin.listElec.candidateTable.person')}
            </TableHeaderCell>
            <TableHeaderCell>
              {t('admin.listElec.candidateTable.fieldOfStudy')}
            </TableHeaderCell>
            <TableHeaderCell>
              {t('admin.listElec.candidateTable.preAccumulated')}
            </TableHeaderCell>
            <TableHeaderCell alignRight>
              {!electionIsLocked && (
                <ActionItem action={() => setDisplayNewCandidateForm(true)}>
                  <Icon type="plussign" marginRight />
                  {t('election.addCandidate')}
                </ActionItem>
              )}
            </TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {displayNewCandidateForm && (
            <TableRow>
              <TableCell colspan={5}>
                <ListCandidateForm
                  initialValues={{
                    preCumulated: false,
                    fieldOfStudy: '',
                    priority: electionList.candidates.length + 1,
                  }}
                  handleSubmit={onAdd}
                  isLocked={electionIsLocked}
                  cancelAction={() => setDisplayNewCandidateForm(false)}
                  formHeader={t('admin.listElec.addCandidate')}
                />
              </TableCell>
            </TableRow>
          )}
          {sortedCandidates.length > 0 ? (
            sortedCandidates.map((candidate: Candidate) =>
              candidate.id === editCandidateId ? (
                <TableRow key={candidate.id}>
                  <TableCell colspan={5}>
                    <ListCandidateForm
                      initialValues={{ ...candidate }}
                      handleSubmit={onUpdate}
                      deleteAction={() => onDelete(candidate)}
                      isLocked={electionIsLocked}
                      cancelAction={() => setEditCandidateId('')}
                      formHeader={t('admin.listElec.editCandidate')}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow
                  key={candidate.id}
                  onClick={() => setEditCandidateId(candidate.id)}
                >
                  <TableCell>
                    <Text>{candidate.priority}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{candidate.name}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{candidate.meta.fieldOfStudy}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>
                      {candidate.preCumulated
                        ? t('general.yes')
                        : t('general.no')}
                    </Text>
                  </TableCell>
                  <TableCell alignRight>
                    <Text>
                      <ActionText
                        action={() => setEditCandidateId(candidate.id)}
                      >
                        {t('general.edit')}
                      </ActionText>
                    </Text>
                  </TableCell>
                </TableRow>
              )
            )
          ) : (
            <TableRow>
              <TableCell />
              <TableCell>
                <Text>{t('admin.listElec.noCandidatesInList')}</Text>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
