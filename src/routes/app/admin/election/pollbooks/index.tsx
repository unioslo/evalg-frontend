import gql from 'graphql-tag';
import * as React from 'react';
import { Mutation, Query } from 'react-apollo';
import { Field, Form } from 'react-final-form';

import AddVoter from './components/AddVoter';

import ActionText from 'components/actiontext';
import {
  ActionButton, ElectionButton, ElectionButtonContainer
} from 'components/button';
import { DropDownRF, FormButtons } from 'components/form';
import { ConfirmModal } from 'components/modal';
import { Page, PageSection } from 'components/page';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableRow
} from 'components/table';
import Text from 'components/text';
import { Trans, translate } from 'react-i18next';

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

const electionGroupQuery = gql`
  query electionGroupVoters($id: UUID!) {
    electionGroup(id: $id) {
      id
      name
      description
      type
      candidateType

      mandateType
      meta
      ouId
      publicKey
      announcedAt
      publishedAt
      cancelledAt
      deletedAt
      status
      cancelled
      announced
      published
      deleted
      elections {
        id
        name
        description
        type
        candidateType
        mandateType
        meta
        sequence
        start
        end
        informationUrl
        contact
        mandatePeriodStart
        mandatePeriodEnd
        groupId
        active
        status
        publishedAt
        cancelledAt
        lists {
          id
          name
          description
          informationUrl
          candidates {
            id
            name
            meta
            informationUrl
            priority
            preCumulated
            userCumulated
            listId
          }
        }
        pollbooks {
          id
          name
          weight
          priority
          voters {
            id
            pollbookId
            person {
              id
              firstName
              lastName
              nin
            }
          }
        }
      }
    }
  }
`;

const addVoter = gql`
  mutation addVoter($personId: UUID!, $pollbookId: UUID!) {
    addVoter(personId: $personId, pollbookId: $pollbookId) {
      ok
    }
  }
`;


const refetchQueries = () => ['electionGroupVoters'];

interface IUpdateVoterForm {
  submitAction: (o: object) => void,
  closeAction: () => void,
  deleteAction: () => void,
  options: DropDownOption[],
  initialValues: object
}



const UpdateVoterForm: React.SFC<IUpdateVoterForm> = (props) => {
  const { closeAction, deleteAction, options, submitAction, initialValues } = props;

  const renderForm = (formProps: any) => {
    const { handleSubmit, pristine, valid } = formProps;
    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="pollbookId"
          component={DropDownRF}
          options={options}
        />
        <FormButtons
          saveAction={handleSubmit}
          closeAction={closeAction}
          submitDisabled={pristine || !valid}
          entityAction={deleteAction}
          entityText={<Trans>election.deleteCandidate</Trans>}
        />
      </form>
    )
  }
  return (
    <Form
      onSubmit={submitAction}
      initialValues={initialValues}
      render={renderForm}
    />
  );
};

interface IProps {
  t: (t: string) => string,
  i18n: any,
  groupId: string
};


interface IState {
  pollBookId: string,
  voterId: string,
  updateVoterId: string,
  showDeleteVoter: boolean,
  showAddVoter: string
};

class ElectionGroupCensuses extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      pollBookId: '',
      showAddVoter: '',
      showDeleteVoter: false,
      updateVoterId: '',
      voterId: ''
    };
    this.closeUpdateVoterForm = this.closeUpdateVoterForm.bind(this);
    this.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
    this.hideDeleteConfirmation = this.hideDeleteConfirmation.bind(this);
    this.closeNewVoterForm = this.closeNewVoterForm.bind(this);
  }

  public render() {
    const { t, i18n: { language: lang } } = this.props;
    return (
      <Query
        query={electionGroupQuery}
        variables={{ id: this.props.groupId }}>
        {({ data, loading, error }) => {
          if (loading || error) {
            return null;
          }
          const elections: Election[] = data.electionGroup.elections;
          const voters: IVoter[] = [];
          const pollBookDict = {};
          const pollBookOptions: DropDownOption[] = [];
          elections.forEach((el: Election) => {
            el.pollbooks.forEach(pollBook => {
              pollBookDict[pollBook.id] = pollBook;
              pollBook.voters.forEach(voter => {
                voters.push(voter);
              })
              pollBookOptions.push({ name: pollBook.name[lang], value: pollBook.id });
            });
          });
          const pollbookButtons: JSX.Element[] = []
          elections.forEach((e, index) => {
            e.pollbooks.forEach((pollbook, i) => {
              pollbookButtons.push(
                <ElectionButton hoverText={<Trans>census.addPerson</Trans>}
                  name={pollbook.name[lang]}
                  key={`${index}${i}`}
                  count={pollbook.voters.length}
                  minCount={false}
                  action={this.showNewVoterForm.bind(this, pollbook.id)}
                />
              )
            })
          })
          return (
            <Page header={<Trans>election.censuses</Trans>}>
              <PageSection noBorder={true} desc={<Trans>census.censusPageDesc</Trans>}>
                <ActionButton text={t('census.uploadCensusFile')} />
              </PageSection>
              <PageSection header={<Trans>election.census</Trans>} noBorder={true}>
                <ElectionButtonContainer>
                  {pollbookButtons}
                </ElectionButtonContainer>
                <Table>
                  <TableHeader>
                    <TableHeaderRow>
                      <TableHeaderCell>
                        <Trans>census.person</Trans>
                      </TableHeaderCell>
                      <TableHeaderCell>
                        <Trans>census.group</Trans>
                      </TableHeaderCell>
                      <TableHeaderCell />
                    </TableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {this.state.showAddVoter ?
                      <TableRow verticalPadding={true}>
                        <TableCell colspan={3}>
                          <Mutation
                            mutation={addVoter}
                            refetchQueries={refetchQueries}>
                            {(add) => {
                              const addAndClose = (values: any) => {
                                values.persons.map((person: IPerson) =>
                                  add(
                                    {
                                      variables: {
                                        personId: person.id,
                                        pollbookId: this.state.showAddVoter
                                      }
                                    }));
                                this.closeNewVoterForm();
                              };
                              return (
                                <AddVoter
                                  closeAction={this.closeNewVoterForm}
                                  submitAction={addAndClose}
                                  pollbook={pollBookDict[this.state.showAddVoter]}
                                  initialValues={{}}
                                />
                              )
                            }}
                          </Mutation>
                        </TableCell>
                      </TableRow>
                      : null
                    }
                    {voters.map((voter, index) => {
                      if (voter.id === this.state.updateVoterId) {
                        return (
                          <TableRow key={index} verticalPadding={true}>
                            <TableCell>
                              <Text>
                                {voter.person.firstName + ' ' + voter.person.lastName}
                              </Text>
                            </TableCell>
                            <TableCell colspan={2}>
                              <Mutation
                                mutation={updateVoterPollBook}
                                refetchQueries={refetchQueries}>
                                {(updateVoter) => {
                                  const update = (values: { id: string, pollbookId: string }) => {
                                    updateVoter({ variables: values });
                                    this.closeUpdateVoterForm();
                                  }
                                  return (
                                    <UpdateVoterForm
                                      initialValues={{ pollbookId: voter.pollbookId, id: voter.id }}
                                      submitAction={update}
                                      closeAction={this.closeUpdateVoterForm}
                                      options={pollBookOptions}
                                      deleteAction={this.showDeleteConfirmation}
                                    />
                                  )
                                }}
                              </Mutation>
                              {this.state.showDeleteVoter ?
                                <Mutation
                                  mutation={deleteVoter}
                                  refetchQueries={refetchQueries}>
                                  {(delet) => {
                                    const deleteAndClose = () => {
                                      delet({ variables: { id: voter.id } });
                                      this.hideDeleteConfirmation();
                                    };
                                    return (
                                      <ConfirmModal
                                        confirmAction={deleteAndClose}
                                        closeAction={this.hideDeleteConfirmation}
                                        header={
                                          <Trans>census.deletePersonConfirmationModalTitle</Trans>
                                        }
                                        body={
                                          <Trans values={{
                                            personName: voter.person.firstName + " " + voter.person.lastName,
                                            pollbookName: pollBookDict[voter.pollbookId].name[lang]
                                          }}>census.deletePersonConfirmationModalText</Trans>
                                        }
                                        confirmText={<Trans>general.delete</Trans>}
                                        closeText={<Trans>general.cancel</Trans>}
                                      />
                                    )
                                  }
                                  }
                                </Mutation> : null
                              }
                            </TableCell>
                          </TableRow>
                        )
                      }
                      else {
                        return (
                          <TableRow key={index} actionTextOnHover={true}>
                            <TableCell>
                              <Text>
                                {voter.person.firstName + ' ' + voter.person.lastName}
                              </Text>
                            </TableCell>
                            <TableCell>
                              <Text>
                                {pollBookDict[voter.pollbookId].name[lang]}
                              </Text>
                            </TableCell>
                            <TableCell alignRight={true}>
                              <Text>
                                <ActionText
                                  action={this.showUpdateVoterForm.bind(this, voter.id)}>
                                  <Trans>general.edit</Trans>
                                </ActionText>
                              </Text>
                            </TableCell>
                          </TableRow>
                        )
                      }
                    })}
                  </TableBody>
                </Table>
              </PageSection>
            </Page>
          )
        }}
      </Query>
    )
  }

  private showNewVoterForm(pollbookId: string) {
    this.setState({ showAddVoter: pollbookId })
  }

  private closeNewVoterForm() {
    this.setState({ showAddVoter: "" });
  }

  private showDeleteConfirmation() {
    this.setState({ showDeleteVoter: true });
  }

  private hideDeleteConfirmation() {
    this.setState({ showDeleteVoter: false });
  }

  private showUpdateVoterForm(voterId: string) {
    this.setState({ updateVoterId: voterId })
  }

  private closeUpdateVoterForm() {
    this.setState({ updateVoterId: '' })
  }
}

export default translate()(ElectionGroupCensuses);
