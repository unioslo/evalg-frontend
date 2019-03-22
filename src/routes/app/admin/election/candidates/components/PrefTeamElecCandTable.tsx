import * as React from 'react';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Text from '../../../../../../components/text';
import Link from '../../../../../../components/link';
import ActionText from '../../../../../../components/actiontext';
import ActionItem from '../../../../../../components/actionitem';
import { PageSection } from '../../../../../../components/page';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '../../../../../../components/table';
import Icon from '../../../../../../components/icon';

import PrefTeamElecCandForm from './PrefTeamElecCandForm';
import NoCandidatesRow from './NoCandidatesRow';
import { ElectionGroup } from '../../../../../../interfaces';

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

interface IProps extends WithTranslation {
  children?: React.ReactNode;
  electionGroup: ElectionGroup;
  createCandidate?: (a: any) => void;
  updateCandidate?: (a: any) => void;
  createCoCandidate?: (a: any) => void;
  updateCoCandidate?: (a: any) => void;
}

interface IState {
  newFormTopActive: boolean;
  newFormBottomActive: boolean;
  editCandidateId: number;
}

class PrefTeamElecCandTable extends React.Component<IProps, IState> {
  state: IState;
  removeEmptyCoCandidates: (e: any) => any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      newFormBottomActive: false,
      newFormTopActive: false,
      editCandidateId: -1,
    };
    this.setNewFormsInactive = this.setNewFormsInactive.bind(this);
    this.setNewFormTopActive = this.setNewFormTopActive.bind(this);
    this.setNewFormBottomActive = this.setNewFormBottomActive.bind(this);
    this.setEditId = this.setEditId.bind(this);
    this.removeEmptyCoCandidates = this.removeCoCandidatesWithoutName.bind(
      this
    );
  }

  setNewFormTopActive() {
    this.setState({ newFormTopActive: true, newFormBottomActive: false });
  }

  setNewFormBottomActive() {
    this.setState({ newFormBottomActive: true, newFormTopActive: false });
  }

  setNewFormsInactive() {
    this.setState({ newFormTopActive: false, newFormBottomActive: false });
  }

  setEditId(id: any) {
    this.setNewFormsInactive();
    this.setState({ editCandidateId: id });
  }

  removeCoCandidatesWithoutName(newCandidateSubmitValues: any) {
    return {
      ...newCandidateSubmitValues,
      coCandidates: newCandidateSubmitValues.coCandidates.filter(
        (coCandidate: any) => coCandidate.name
      ),
    };
  }

  render() {
    const candidateList = this.props.electionGroup.elections[0].lists[0];
    if (!candidateList) {
      return (
        <PageSection noBorder desc={<Trans>election.prefTeamHeader</Trans>}>
          <p>
            <Trans>election.noActiveElections</Trans>
          </p>
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
      <PageSection noBorder desc={<Trans>election.prefTeamHeader</Trans>}>
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>
                <Trans>election.candidate</Trans>
              </TableHeaderCell>
              <TableHeaderCell>
                <Trans>election.coCandidates</Trans>
              </TableHeaderCell>
              <TableHeaderCell alignRight>
                <ActionItem action={this.setNewFormTopActive.bind(this)}>
                  <Icon type="plussign" marginRight />
                  <Trans>election.addCandidate</Trans>
                </ActionItem>
              </TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {this.state.newFormTopActive && (
              <Mutation
                mutation={addTeamPrefElecCandidate}
                refetchQueries={() => ['electionGroup']}
              >
                {addCand => (
                  <TableRow>
                    <TableCell colspan={3}>
                      <PrefTeamElecCandForm
                        initialValues={newCandidateValues}
                        handleSubmit={values => {
                          values = this.removeCoCandidatesWithoutName(values);
                          addCand({ variables: values });
                          this.setNewFormsInactive();
                        }}
                        cancelAction={this.setNewFormsInactive}
                        formHeader={
                          <Trans>election.addPrefTeamCandidate</Trans>
                        }
                      />
                    </TableCell>
                  </TableRow>
                )}
              </Mutation>
            )}
            {candidates.length === 0 ? <NoCandidatesRow colSpan={3} /> : null}
            {candidates.length > 0
              ? candidates.map((candidate: any, index: any) => {
                  if (candidate.id === this.state.editCandidateId) {
                    return (
                      <TableRow key={index}>
                        <TableCell colspan={3}>
                          <Mutation
                            mutation={deleteCandidate}
                            refetchQueries={() => ['electionGroup']}
                          >
                            {deleteCand => (
                              <Mutation
                                mutation={updateTeamPrefElecCandidate}
                                refetchQueries={() => ['electionGroup']}
                              >
                                {updCand => (
                                  <PrefTeamElecCandForm
                                    formHeader={
                                      <Trans>election.editCandidate</Trans>
                                    }
                                    initialValues={{ ...candidate }}
                                    handleSubmit={(values: any) => {
                                      values = this.removeCoCandidatesWithoutName(
                                        values
                                      );
                                      updCand({ variables: values });
                                      this.setEditId('');
                                    }}
                                    cancelAction={this.setEditId.bind(-1)}
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
                  const { coCandidates } = candidate;
                  return (
                    <TableRow key={index} actionTextOnHover>
                      <TableCell>
                        <Text>{candidate.name}</Text>
                        {candidate.informationUrl && (
                          <Text size="small">
                            <Link to={candidate.informationUrl} external>
                              {candidate.informationUrl}
                            </Link>
                          </Text>
                        )}
                      </TableCell>
                      <TableCell>
                        <Text>
                          {coCandidates.map((coCandidate: any, i: any) => {
                            if (i === coCandidates.length - 1) {
                              return coCandidate.name;
                            }
                            return `${coCandidate.name}, `;
                          })}
                        </Text>
                      </TableCell>
                      <TableCell alignRight>
                        <Text>
                          <ActionText
                            action={this.setEditId.bind(this, candidate.id)}
                          >
                            <Trans>general.edit</Trans>
                          </ActionText>
                        </Text>
                      </TableCell>
                    </TableRow>
                  );
                })
              : null}
            <TableRow>
              {this.state.newFormBottomActive ? (
                <Mutation
                  mutation={addTeamPrefElecCandidate}
                  refetchQueries={() => ['electionGroup']}
                >
                  {addCand => (
                    <TableCell colspan={3}>
                      <PrefTeamElecCandForm
                        initialValues={newCandidateValues}
                        handleSubmit={(values: any) => {
                          values = this.removeCoCandidatesWithoutName(values);
                          addCand({ variables: values });
                          this.setNewFormsInactive();
                        }}
                        cancelAction={this.setNewFormsInactive}
                        formHeader={
                          <Trans>election.addPrefTeamCandidate</Trans>
                        }
                      />
                    </TableCell>
                  )}
                </Mutation>
              ) : (
                <TableCell colspan={3}>
                  <ActionText action={this.setNewFormBottomActive.bind(this)}>
                    <Trans>election.addPrefTeamCandidate</Trans>
                  </ActionText>
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </PageSection>
    );
  }
}

export default withTranslation()(PrefTeamElecCandTable);
