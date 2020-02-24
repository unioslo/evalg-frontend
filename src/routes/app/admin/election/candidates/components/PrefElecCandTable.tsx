import React from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';

import { PageSection } from 'components/page';
import Text from 'components/text';
import { ElectionButton, ElectionButtonContainer } from 'components/button';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from 'components/table';

import ActionText from 'components/actiontext';
import { ElectionGroup } from '../../../../../../interfaces';

import TableRowWithText from './TableRowWithText';
import PrefElecCandForm from './PrefElecCandForm';

const addPrefElecCandidate = gql`
  mutation AddPrefElecCandidate(
    $name: String!
    $gender: String!
    $informationUrl: String
    $listId: UUID!
  ) {
    addPrefElecCandidate(
      name: $name
      gender: $gender
      informationUrl: $informationUrl
      listId: $listId
    ) {
      ok
    }
  }
`;

const updatePrefElecCandidate = gql`
  mutation UpdatePrefElecCandidate(
    $id: UUID!
    $name: String!
    $gender: String!
    $informationUrl: String
    $listId: UUID!
  ) {
    updatePrefElecCandidate(
      id: $id
      name: $name
      gender: $gender
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

interface IProps extends WithTranslation {
  children?: React.ReactNode;
  electionGroup: ElectionGroup;
}

interface IState {
  newFormListId: string;
  editCandidateId: string;
}

class PrefElecCandTable extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      newFormListId: '',
      editCandidateId: '',
    };
    this.closeEditForm = this.closeEditForm.bind(this);
    this.closeNewForm = this.closeNewForm.bind(this);
  }

  setNewFormActive(listId: string) {
    this.closeEditForm();
    this.setState({ newFormListId: listId });
  }

  closeNewForm() {
    this.setState({ newFormListId: '' });
  }

  setEditId(id: string) {
    this.closeNewForm();
    this.setState({ editCandidateId: id });
  }

  closeEditForm() {
    this.setState({ editCandidateId: '' });
  }

  render() {
    const { electionGroup: elGrp, i18n } = this.props;
    const lang = i18n.language;
    const { elections } = elGrp;

    const pageDesc = (
      <Trans
        components={[
          <br key="0" />,
          <Link key="1" to={`/admin/elections/${elGrp.id}/info`}>
            text
          </Link>,
        ]}
      >
        prefElec.candPageDesc
      </Trans>
    );

    if (elections.length === 0) {
      return (
        <PageSection noBorder desc={pageDesc}>
          <p>
            <Trans>election.noActiveElections</Trans>
          </p>
        </PageSection>
      );
    }

    const candidates: any[] = [];
    const listDict: any = {};
    elections
      .filter(e => e.active)
      .forEach((e: any) => {
        e.lists.forEach((l: any) => {
          listDict[l.id] = l;
          l.candidates.forEach((c: any) => {
            candidates.push({
              id: c.id,
              name: c.name,
              isLocked: e.isLocked,
              gender: c.meta.gender,
              informationUrl: c.informationUrl,
              listId: c.listId,
            });
          });
        });
      });

    return (
      <Mutation
        mutation={addPrefElecCandidate}
        refetchQueries={() => ['electionGroup']}
      >
        {addCandidate => (
          <Mutation
            mutation={deleteCandidate}
            refetchQueries={() => ['electionGroup']}
          >
            {deleteCand => (
              <Mutation
                mutation={updatePrefElecCandidate}
                refetchQueries={() => ['electionGroup']}
              >
                {updateCandidate => (
                  <PageSection noBorder desc={pageDesc}>
                    <ElectionButtonContainer>
                      {elections.map((election: any, index: any) => {
                        const {
                          seats,
                          substitutes,
                        } = election.meta.candidateRules;
                        // TBD: Should this be only seats?
                        const minCount = seats + substitutes;
                        return (
                          <ElectionButton
                            hoverText={<Trans>election.addCandidate</Trans>}
                            name={election.lists[0].name[lang]}
                            key={index}
                            count={election.lists[0].candidates.length}
                            minCount={minCount}
                            active={election.active && !election.isLocked}
                            counterTextTag="election.candidateCounter"
                            action={this.setNewFormActive.bind(
                              this,
                              election.lists[0].id
                            )}
                          />
                        );
                      })}
                    </ElectionButtonContainer>
                    <Table>
                      <TableHeader>
                        <TableHeaderRow>
                          <TableHeaderCell>
                            <Trans>election.candidate</Trans>
                          </TableHeaderCell>
                          <TableHeaderCell>
                            <Trans>general.gender</Trans>
                          </TableHeaderCell>
                          <TableHeaderCell>
                            <Trans>election.group</Trans>
                          </TableHeaderCell>
                          <TableHeaderCell />
                        </TableHeaderRow>
                      </TableHeader>
                      <TableBody>
                        {this.state.newFormListId ? (
                          <TableRow>
                            <TableCell colspan={4}>
                              <PrefElecCandForm
                                listDict={listDict}
                                candidate={{ listId: this.state.newFormListId }}
                                handleSubmit={values => {
                                  addCandidate({ variables: values });
                                  this.closeNewForm();
                                }}
                                cancelAction={this.closeNewForm}
                                formHeader={
                                  <Trans>election.addCandidate</Trans>
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ) : null}
                        {candidates.length === 0 ? (
                          <TableRowWithText colSpan={4}>
                            <Trans>election.noCandidatesDefined</Trans>
                          </TableRowWithText>
                        ) : null}
                        {candidates.length > 0 &&
                          candidates.map((candidate, index) => {
                            if (candidate.id === this.state.editCandidateId) {
                              return (
                                <TableRow key={index}>
                                  <TableCell colspan={4}>
                                    <PrefElecCandForm
                                      listDict={listDict}
                                      candidate={candidate}
                                      handleSubmit={values => {
                                        updateCandidate({
                                          variables: { ...values },
                                        });
                                        this.closeEditForm();
                                      }}
                                      cancelAction={this.closeEditForm}
                                      deleteAction={() => {
                                        deleteCand({
                                          variables: { id: candidate.id },
                                        });
                                        this.closeEditForm();
                                      }}
                                      formHeader={
                                        <Trans>election.editCandidate</Trans>
                                      }
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            }
                            return (
                              <TableRow key={index} actionTextOnHover>
                                <TableCell>
                                  <Text>{candidate.name}</Text>
                                  <Text size="small">
                                    <a href={candidate.informationUrl}>
                                      {candidate.informationUrl}
                                    </a>
                                  </Text>
                                </TableCell>
                                <TableCell>
                                  <Text>
                                    <Trans>{`general.${candidate.gender}`}</Trans>
                                  </Text>
                                </TableCell>
                                <TableCell>
                                  <Text>
                                    {listDict[candidate.listId].name[lang]}
                                  </Text>
                                </TableCell>
                                <TableCell alignRight>
                                  <Text>
                                    <ActionText
                                      action={this.setEditId.bind(
                                        this,
                                        candidate.id
                                      )}
                                    >
                                      <Trans>general.edit</Trans>
                                    </ActionText>
                                  </Text>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </PageSection>
                )}
              </Mutation>
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default withTranslation()(PrefElecCandTable);
