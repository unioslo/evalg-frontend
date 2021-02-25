import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Text from 'components/text';
import ActionText from 'components/actiontext';
import ActionItem from 'components/actionitem';
import Icon from 'components/icon';
import { PageSection } from 'components/page';
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

import PollElecAlternativeForm from './PollElecAlternativeForm';
import TableRowWithText from './TableRowWithText';

const addTeamPrefElecCandidate = gql`
  mutation AddTeamPrefElecCandidate(
    $name: String!
    $coCandidates: [CoCandidatesInput]!
    $informationUrl: String
    $listId: UUID!
  ) {
    addTeamPrefElecCandidate(
      name: $name
      coCandidates: $coCandidates
      informationUrl: $informationUrl
      listId: $listId
    ) {
      ok
    }
  }
`;

const updateTeamPrefElecCandidate = gql`
  mutation UpdateTeamPrefElecCandidate(
    $id: UUID!
    $name: String!
    $coCandidates: [CoCandidatesInput]!
    $informationUrl: String
    $listId: UUID!
  ) {
    updateTeamPrefElecCandidate(
      id: $id
      name: $name
      coCandidates: $coCandidates
      informationUrl: $informationUrl
      listId: $listId
    ) {
      ok
    }
  }
`;

const deleteCandidate = gql`
  mutation DeleteCandidate($id: UUID!) {
    deleteCandidate(id: $id) {
      ok
    }
  }
`;

interface IProps {
  children?: React.ReactNode;
  electionGroup: ElectionGroup;
}

const PollElecAlternativeTable: React.FunctionComponent<IProps> = props => {
  const [bottomActive, setBottomActive] = useState<boolean>(false);
  const [topActive, setTopActive] = useState<boolean>(false);
  const [editCandidateId, setEditCandidateId] = useState(-1);

  const { t } = useTranslation();

  const { electionGroup } = props;

  const setNewFormTopActive = () => {
    setTopActive(true);
    setBottomActive(false);
  };

  const setNewFormBottomActive = () => {
    setTopActive(false);
    setBottomActive(true);
  };

  const setNewFormsInactive = () => {
    setTopActive(false);
    setBottomActive(false);
  };

  const setEditId = (id: any) => {
    setNewFormsInactive();
    setEditCandidateId(id);
  };

  const candidateList = electionGroup.elections[0].lists[0];
  const electionIsLocked = electionGroup.elections[0].isLocked;
  if (!candidateList) {
    return (
      <PageSection noBorder desc={t('admin.pollElec.header')}>
        <p>{t('election.noActiveElections')}</p>
      </PageSection>
    );
  }

  const candidates = candidateList.candidates.map((candidate: any) => ({
    id: candidate.id,
    name: candidate.name,
    coCandidates: candidate.meta.coCandidates
      ? candidate.meta.coCandidates
      : [],
    informationUrl: candidate.informationUrl,
    listId: candidate.listId,
  }));
  const newCandidateValues = {
    coCandidates: [{ name: '' }],
    listId: candidateList.id,
  };
  return (
    <PageSection noBorder desc={t('admin.pollElec.header')}>
      <Table>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell>{t('admin.pollElec.alternative')}</TableHeaderCell>
            <TableHeaderCell alignRight>
              {!electionIsLocked && (
                <ActionItem action={setNewFormTopActive}>
                  <Icon type="plussign" marginRight />
                  {t('admin.pollElec.addAlternativ')}
                </ActionItem>
              )}
            </TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {topActive && (
            <Mutation
              mutation={addTeamPrefElecCandidate}
              refetchQueries={() => ['electionGroup']}
            >
              {(addCand: any) => (
                <TableRow>
                  <TableCell colspan={3}>
                    <PollElecAlternativeForm
                      initialValues={newCandidateValues}
                      onSubmit={values => {
                        addCand({
                          variables: values,
                        });
                        setNewFormsInactive();
                      }}
                      isLocked={electionIsLocked}
                      cancelAction={setNewFormsInactive}
                      formHeader={t('admin.pollElec.addAlternativ')}
                    />
                  </TableCell>
                </TableRow>
              )}
            </Mutation>
          )}
          {candidates.length === 0 ? (
            <TableRowWithText colSpan={3}>
              {t('admin.pollElec.noAlternative')}
            </TableRowWithText>
          ) : null}
          {candidates.length > 0
            ? candidates.map((candidate: any) => {
                if (candidate.id === editCandidateId) {
                  return (
                    <TableRow key={candidate.id}>
                      <TableCell colspan={3}>
                        <Mutation
                          mutation={deleteCandidate}
                          refetchQueries={() => ['electionGroup']}
                        >
                          {(deleteCand: any) => (
                            <Mutation
                              mutation={updateTeamPrefElecCandidate}
                              refetchQueries={() => ['electionGroup']}
                            >
                              {(updCand: any) => (
                                <PollElecAlternativeForm
                                  formHeader={t(
                                    'admin.pollElec.editAlternative'
                                  )}
                                  initialValues={{ ...candidate }}
                                  onSubmit={(values: any) => {
                                    updCand({
                                      variables: values,
                                    });
                                    setEditId('');
                                  }}
                                  isLocked={electionIsLocked}
                                  cancelAction={() => setEditId(-1)}
                                  deleteAction={() => {
                                    deleteCand({
                                      variables: { id: candidate.id },
                                    });
                                  }}
                                />
                              )}
                            </Mutation>
                          )}
                        </Mutation>
                      </TableCell>
                    </TableRow>
                  );
                }
                return (
                  <TableRow key={candidate.id} actionTextOnHover>
                    <TableCell>
                      <Text>{candidate.name}</Text>
                    </TableCell>
                    <TableCell alignRight>
                      <Text>
                        <ActionText action={() => setEditId(candidate.id)}>
                          {t('general.edit')}
                        </ActionText>
                      </Text>
                    </TableCell>
                  </TableRow>
                );
              })
            : null}
          {!electionIsLocked && (
            <TableRow>
              {bottomActive ? (
                <Mutation
                  mutation={addTeamPrefElecCandidate}
                  refetchQueries={() => ['electionGroup']}
                >
                  {(addCand: any) => (
                    <TableCell colspan={3}>
                      <PollElecAlternativeForm
                        initialValues={newCandidateValues}
                        onSubmit={(values: any) => {
                          addCand({
                            variables: values,
                          });
                          setNewFormsInactive();
                        }}
                        isLocked={electionIsLocked}
                        cancelAction={setNewFormsInactive}
                        formHeader={t('admin.pollElec.addAlternativ')}
                      />
                    </TableCell>
                  )}
                </Mutation>
              ) : (
                <TableCell colspan={3}>
                  <ActionText action={setNewFormBottomActive}>
                    {t('admin.pollElec.addAlternativ')}
                  </ActionText>
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </PageSection>
  );
};

export default PollElecAlternativeTable;
