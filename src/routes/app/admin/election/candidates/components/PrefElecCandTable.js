/* @flow */
import * as React from 'react';
import { Link } from 'react-router-dom';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

import { objPropsToArray } from 'utils';

import { PageSection } from 'components/page';
import Text from 'components/text';
import { Trans, translate } from 'react-i18next';
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
import { DropDown, TextInput } from 'components/form';

import NoCandidatesRow from './NoCandidatesRow';
import NoCandidatesFoundRow from './NoCandidatesFoundRow';
import PrefElecCandForm from './PrefElecCandForm';

const addPrefElecCandidate = gql`
  mutation AddPrefElecCandidate(
    $name: String!,
    $gender: String!,
    $informationUrl: String
    $listId: UUID!) {
    
    addPrefElecCandidate(
      name: $name,
      gender: $gender,
      informationUrl: $informationUrl,
      listId: $listId) {
      ok
    }
  }
`

const updatePrefElecCandidate = gql`
  mutation UpdatePrefElecCandidate(
    $id: UUID!,
    $name: String!,
    $gender: String!,
    $informationUrl: String
    $listId: UUID!) {
    
    updatePrefElecCandidate(
      id: $id,
      name: $name,
      gender: $gender,
      informationUrl: $informationUrl,
      listId: $listId) {
      ok
    }
  }
`

const deleteCandidate = gql`
  mutation DeleteCandidate($id: UUID!) {
    deleteCandidate(id: $id) {
      ok
    }
  }
`


const getFilteredCandidates = ((candidates: Array<Object>, nameFilter: string,
  genderFilter: string, listFilter: string) => {
  return candidates.filter(candidate => {
    const { name, meta, listId } = candidate;
    const gender = meta ? meta.gender : null;
    if (nameFilter && !name.toLowerCase().includes(nameFilter.toLowerCase())) {
      return false;
    }
    if (genderFilter && genderFilter !== 'all' && gender !== genderFilter) {
      return false;
    }
    if (listFilter && listFilter !== 'all' && listId !== listFilter) {
      return false;
    }
    return true;
  })
});

const buildGenderFilterOptions = (t) => {
  return [
    { name: t('general.all'), value: 'all' },
    { name: t('general.male'), value: 'male' },
    { name: t('general.female'), value: 'female' },
  ]
};

const buildListFilterOptions = (listDict, lang, t) => {
  const filterOptions = [];
  filterOptions.push({ name: t('general.all'), value: 'all' });
  Object.keys(listDict).forEach(id => {
    filterOptions.push({ name: listDict[id].name[lang], value: id });
  });
  return filterOptions;
};

type Props = {
  children?: ReactChildren,
  electionGroup: Object,
  t: Function,
  i18n: Object,
};

type State = {
  newFormListId: string,
  editCandidateId: string,
  nameFilter: string,
  genderFilter: string,
  listFilter: string
}

class PrefElecCandTable extends React.Component<Props, State> {
  closeEditForm: Function;
  closeNewForm: Function;

  constructor(props: Props) {
    super(props);
    this.state = {
      newFormListId: '',
      editCandidateId: '',
      nameFilter: '',
      genderFilter: '',
      listFilter: ''
    }
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

  handleNameFilterChange(nameFilter) {
    this.setState({ nameFilter });
  }

  handleGenderFilterChange(genderFilter) {
    this.setState({ genderFilter });
  }

  handleListFilterChange(listFilter) {
    this.setState({ listFilter });
  }

  render() {
    const { electionGroup: elGrp, t } = this.props;
    const lang = this.props.i18n.language;
    const { elections } = elGrp;

    const pageDesc =
      <Trans
        components={[
          <br key="0" />,
          <Link key="1" to={`/admin/elections/${elGrp.id}/info`}>text</Link>
        ]}>
        prefElec.candPageDesc
      </Trans>

    if (elections.length === 0) {
      return (
        <PageSection desc={pageDesc}>
          <p><Trans>election.noActiveElections</Trans></p>
        </PageSection>
      )
    }

    const unFilteredCandidates = [];
    const listDict = {};
    elections.forEach(e => {
      e.lists.forEach(l => {
        listDict[l.id] = l;
        l.candidates.forEach(c => {
          unFilteredCandidates.push({
            id: c.id,
            name: c.name,
            gender: c.meta.gender,
            informationUrl: c.informationUrl,
            listId: c.listId
          })
        })
      })
    })

    const { nameFilter, genderFilter, listFilter } = this.state;
    const genderFilterOptions = buildGenderFilterOptions(t);
    const listFilterOptions = buildListFilterOptions(listDict, lang, t);
    const candidates = getFilteredCandidates(
      unFilteredCandidates, nameFilter, genderFilter, listFilter
    );
    return (
      <Mutation
        mutation={addPrefElecCandidate}
        refetchQueries={() => ['electionGroup']}>
        {(addCandidate) => (
          <Mutation
            mutation={deleteCandidate}
            refetchQueries={() => ['electionGroup']}>
            {(deleteCand) => (
              <Mutation
                mutation={updatePrefElecCandidate}
                refetchQueries={() => ['electionGroup']}>
                {(updateCandidate) => (
                  <PageSection desc={pageDesc}>
                    <ElectionButtonContainer>
                      {elections.map((election, index) => {
                        const { seats, substitutes } =
                          election.meta.candidateRules;
                        // TBD: Should this be only seats?
                        const minCount = seats + substitutes;
                        return (
                          <ElectionButton
                            hoverText={<Trans>election.addCandidate</Trans>}
                            name={election.lists[0].name[lang]}
                            key={index}
                            count={election.lists[0].candidates.length}
                            minCount={minCount}
                            active={election.active}
                            counterTextTag="election.candidateCounter"
                            action={this.setNewFormActive.bind(this, election.lists[0].id)}
                          />
                        )
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
                        {unFilteredCandidates.length > 0 &&
                          <TableRow>
                            <TableCell>
                              <TextInput
                                onChange={this.handleNameFilterChange.bind(this)}
                                name={t('general.name')}
                                placeholder={t('general.name')}
                                value={this.state.nameFilter}
                                narrow
                              />
                            </TableCell>
                            <TableCell>
                              <DropDown
                                options={genderFilterOptions}
                                onChange={this.handleGenderFilterChange.bind(this)}
                                placeholder={t('general.gender')}
                                value={this.state.genderFilter}
                              />
                            </TableCell>
                            <TableCell>
                              <DropDown
                                options={listFilterOptions}
                                onChange={this.handleListFilterChange.bind(this)}
                                placeholder={t('general.group')}
                                value={this.state.listFilter}
                                large
                              />
                            </TableCell>
                            <TableCell />
                          </TableRow>
                        }
                        {this.state.newFormListId ?
                          <TableRow>
                            <TableCell colspan="4">
                              <PrefElecCandForm
                                listDict={listDict}
                                candidate={{ listId: this.state.newFormListId }}
                                handleSubmit={(values) => {
                                  addCandidate({ variables: values });
                                  this.closeNewForm();
                                }}
                                cancelAction={this.closeNewForm}
                                formHeader={<Trans>election.addCandidate</Trans>}
                              />
                            </TableCell>
                          </TableRow> : null
                        }
                        {unFilteredCandidates === 0 ?
                          <NoCandidatesRow colSpan={4} /> : null
                        }
                        {unFilteredCandidates.length > 0 ?
                          candidates.length === 0 &&
                          <NoCandidatesFoundRow colSpan={4} /> : null
                        }
                        {candidates.length > 0 &&
                          candidates.map((candidate, index) => {
                            if (candidate.id === this.state.editCandidateId) {
                              return (
                                <TableRow key={index}>
                                  <TableCell colspan="4">
                                    <PrefElecCandForm
                                      listDict={listDict}
                                      candidate={candidate}
                                      handleSubmit={(values) => {
                                        updateCandidate({ variables: { ...values } });
                                        this.closeEditForm();
                                      }}
                                      cancelAction={this.closeEditForm}
                                      deleteAction={() => {
                                        deleteCand({ variables: { id: candidate.id } });
                                        this.closeEditForm();
                                      }}
                                      formHeader={<Trans>election.editCandidate</Trans>}
                                    />
                                  </TableCell>
                                </TableRow>
                              )
                            }
                            return (
                              <TableRow key={index} actionTextOnHover>
                                <TableCell>
                                  <Text>
                                    {candidate.name}
                                  </Text>
                                  <Text size="small">
                                    <a href={candidate.informationUrl}>{candidate.informationUrl}</a>
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
                                    <ActionText action={
                                      this.setEditId.bind(this, candidate.id)}>
                                      <Trans>general.edit</Trans>
                                    </ActionText>
                                  </Text>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        }
                      </TableBody>
                    </Table>
                  </PageSection>
                )}
              </Mutation>
            )}
          </Mutation>
        )}
      </Mutation>
    )
  }
}

export default translate()(PrefElecCandTable);
