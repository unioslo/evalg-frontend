import gql from 'graphql-tag';
import * as React from 'react';
import { Mutation, Query } from 'react-apollo';
import { Field, Form } from 'react-final-form';
import { Trans, translate } from 'react-i18next';

import { orderMultipleElections } from 'utils/processGraphQLData';
import AddVoter from './components/AddVoter';
import ActionText from 'components/actiontext';
import Button, {
  ActionButton,
  ElectionButton,
  ElectionButtonContainer,
  ButtonContainer,
} from 'components/button';
import { DropDownRF, FormButtons } from 'components/form';
import Link from 'components/link';
import { MsgBox } from 'components/msgbox';
import { ConfirmModal } from 'components/modal';
import { Page, PageSection } from 'components/page';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from 'components/table';
import Text from 'components/text';
import { Redirect } from 'react-router';
import UploadCensusFileModal, { IReturnStatus } from './components/UploadCensusFile';

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

const deleteVotersInPollbook = gql`
  mutation DeleteVotersInPollBook($id: UUID!) {
    deleteVotersInPollbook(id: $id) {
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
  submitAction: (o: object) => void;
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
        <Field name="pollbookId" component={DropDownRF} options={options} />
        <FormButtons
          saveAction={handleSubmit}
          closeAction={closeAction}
          submitDisabled={pristine || !valid}
          entityAction={deleteAction}
          entityText={<Trans>election.deleteCandidate</Trans>}
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
  t: (t: string) => string;
  i18n: any;
  groupId: string;
}

interface IState {
  pollBookId: string;
  voterId: string;
  updateVoterId: string;
  showDeletePollbook: boolean;
  showDeleteVoter: boolean;
  showAddVoter: string;
  proceed: boolean;
  showUploadCensusFileModal: boolean;
  showUploadMsgBox: boolean;
  uploadMsg: string | React.ReactElement<any>;
}

class ElectionGroupCensuses extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      pollBookId: '',
      showAddVoter: '',
      showDeletePollbook: false,
      showDeleteVoter: false,
      updateVoterId: '',
      voterId: '',
      proceed: false,
      showUploadCensusFileModal: false,
      showUploadMsgBox: false,
      uploadMsg: '',
    };
    this.closeUpdateVoterForm = this.closeUpdateVoterForm.bind(this);
    this.showDeletePersonConfirmation = this.showDeletePersonConfirmation.bind(
      this
    );
    this.hideDeletePersonConfirmation = this.hideDeletePersonConfirmation.bind(
      this
    );
    this.showDeletePollbookConfirmation = this.showDeletePollbookConfirmation.bind(
      this
    );
    this.hideDeletePollbookConfirmation = this.hideDeletePollbookConfirmation.bind(
      this
    );
    this.closeNewVoterForm = this.closeNewVoterForm.bind(this);
    this.showUploadCensusFileModal = this.showUploadCensusFileModal.bind(this);
    this.closeUploadCensusFileModal = this.closeUploadCensusFileModal.bind(
      this
    );
  }

  showNewVoterForm(pollbookId: string) {
    this.setState({ showAddVoter: pollbookId });
  }

  closeNewVoterForm() {
    this.setState({ showAddVoter: '' });
  }

  showDeletePersonConfirmation() {
    this.setState({ showDeleteVoter: true });
  }

  hideDeletePersonConfirmation() {
    this.setState({ showDeleteVoter: false });
  }

  showDeletePollbookConfirmation() {
    this.setState({ showDeletePollbook: true });
  }

  hideDeletePollbookConfirmation() {
    this.setState({ showDeletePollbook: false });
  }
  showUpdateVoterForm(voterId: string) {
    this.setState({ updateVoterId: voterId });
  }

  closeUpdateVoterForm() {
    this.setState({ updateVoterId: '' });
  }

  handleProceed = () => {
    this.setState({ proceed: true });
  };

  showUploadCensusFileModal() {
    this.closeUpdateVoterForm();

    this.setState({
      showUploadCensusFileModal: true,
      showUploadMsgBox: false,
    });
  }

  closeUploadCensusFileModal(props: IReturnStatus) {
    this.setState({
      showUploadCensusFileModal: false,
    });

    if (props.showMsg) {

      let msg: string | React.ReactElement<any>;
      if (props.parseCompleded) {
        msg = <Trans values={{nr: props.ok, pollbookName: props.pollBookName}}>census.uploadOkMsg</Trans>
      } else {
        msg = <Trans>census.uploadServerError</Trans>
      }
      this.setState({
        showUploadMsgBox: true,
        uploadMsg: msg,
      });
    }
  }

  render() {
    const {
      t,
      i18n: { language: lang },
    } = this.props;
    return (
      <Query query={electionGroupQuery} variables={{ id: this.props.groupId }}>
        {({ data, loading, error, refetch }) => {
          if (loading || error) {
            return null;
          }

          const electionsRaw: Election[] = data.electionGroup.elections;
          const elections =
            data.electionGroup.type === 'multiple_elections'
              ? orderMultipleElections(electionsRaw)
              : electionsRaw;

          const voters: IVoter[] = [];
          const pollBookDict = {};
          const pollBookRadioButtonOptions = {}
          const pollBookOptions: DropDownOption[] = [];

          elections.forEach((el: Election) => {
            el.pollbooks.forEach(pollBook => {
              pollBookDict[pollBook.id] = pollBook;
              pollBook.voters.forEach(voter => {
                voters.push(voter);
              });
              pollBookOptions.push({
                name: pollBook.name[lang],
                value: pollBook.id,
              });
              pollBookRadioButtonOptions[pollBook.id] = {
                  name: pollBook.name,
                  value: pollBook.id,
                  active: el.active,
              }
            });
          });
          const pollbookButtons: JSX.Element[] = [];
          elections.forEach((e, index) => {
            e.pollbooks.forEach((pollbook, i) => {
              pollbookButtons.push(
                <ElectionButton
                  hoverText={<Trans>census.addPerson</Trans>}
                  name={pollbook.name[lang]}
                  key={`${index}${i}`}
                  count={pollbook.voters.length}
                  minCount={false}
                  action={this.showNewVoterForm.bind(this, pollbook.id)}
                  active={e.active}
                />
              );
            });
          });
          return (
            <Page header={<Trans>election.censuses</Trans>}>
              <PageSection
                noBorder={true}
                noTopPadding={true}
                desc={<Trans>census.censusPageDesc</Trans>}
              >

              <div onClick={this.showUploadCensusFileModal}>
                <ActionButton text={t('census.uploadCensusFileButton')} />
              </div>

              <div>
                <Trans>census.aboutCensusFiles</Trans>
                <Link external to="https://www.uio.no/for-ansatte/arbeidsstotte/arrangere-valg/" />
              </div>

              </PageSection>
              <PageSection header={<Trans>election.census</Trans>}>
                <ElectionButtonContainer>
                  {pollbookButtons}
                </ElectionButtonContainer>

                {this.state.showUploadMsgBox ? (
                  <MsgBox msg={this.state.uploadMsg} timeout={true} />
                ) : null}

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
                    {this.state.showAddVoter ? (
                      <TableRow verticalPadding={true}>
                        <TableCell colspan={3}>
                          <Mutation
                            mutation={addVoter}
                            refetchQueries={refetchQueries}
                          >
                            {add => (
                              <>
                                <Mutation
                                  mutation={deleteVotersInPollbook}
                                  refetchQueries={refetchQueries}
                                >
                                  {del => {
                                    const addAndClose = (persons: IPerson[]) => {
                                      persons.map(person =>
                                        add({
                                          variables: {
                                            personId: person.id,
                                            pollbookId: this.state.showAddVoter,
                                          },
                                        })
                                      );
                                      this.closeNewVoterForm();
                                    };
                                    const deletePollbookAndClose = () => {
                                      del({
                                        variables: {
                                          id: this.state.showAddVoter,
                                        },
                                      });
                                      this.hideDeletePollbookConfirmation();
                                      this.closeNewVoterForm();
                                    };
                                    return (
                                      <>
                                        <AddVoter
                                          closeAction={this.closeNewVoterForm}
                                          submitAction={addAndClose}
                                          deletePollbookAction={
                                            this.showDeletePollbookConfirmation
                                          }
                                          pollbook={
                                            pollBookDict[
                                              this.state.showAddVoter
                                            ]
                                          }
                                          registeredVoters={voters}
                                        />
                                        {this.state.showDeletePollbook ? (
                                          <ConfirmModal
                                            confirmAction={
                                              deletePollbookAndClose
                                            }
                                            closeAction={
                                              this
                                                .hideDeletePollbookConfirmation
                                            }
                                            header={
                                              <Trans>
                                                census.deletePollbookConfirmationModalTitle
                                              </Trans>
                                            }
                                            body={
                                              <Trans
                                                values={{
                                                  num:
                                                    pollBookDict[
                                                      this.state.showAddVoter
                                                    ].voters.length,
                                                  of: t(
                                                    pollBookDict[
                                                      this.state.showAddVoter
                                                    ].voters.length === 1
                                                      ? 'census.person'
                                                      : 'census.persons'
                                                  ).toLowerCase(),
                                                  pollbookName:
                                                    pollBookDict[
                                                      this.state.showAddVoter
                                                    ].name[lang],
                                                }}
                                              >
                                                census.deletePollbookConfirmationModalText
                                              </Trans>
                                            }
                                            confirmText={
                                              <Trans>general.delete</Trans>
                                            }
                                            closeText={
                                              <Trans>general.cancel</Trans>
                                            }
                                          />
                                        ) : null}
                                      </>
                                    );
                                  }}
                                </Mutation>
                              </>
                            )}
                          </Mutation>
                        </TableCell>
                      </TableRow>
                    ) : null}
                    {voters.map((voter, index) => {
                      if (voter.id === this.state.updateVoterId) {
                        return (
                          <TableRow key={index} verticalPadding={true}>
                            <TableCell>
                              <Text>
                                {voter.person.firstName +
                                  ' ' +
                                  voter.person.lastName}
                              </Text>
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
                                    this.closeUpdateVoterForm();
                                  };
                                  return (
                                    <UpdateVoterForm
                                      initialValues={{
                                        pollbookId: voter.pollbookId,
                                        id: voter.id,
                                      }}
                                      submitAction={update}
                                      closeAction={this.closeUpdateVoterForm}
                                      options={pollBookOptions}
                                      deleteAction={
                                        this.showDeletePersonConfirmation
                                      }
                                    />
                                  );
                                }}
                              </Mutation>
                              {this.state.showDeleteVoter ? (
                                <Mutation
                                  mutation={deleteVoter}
                                  refetchQueries={refetchQueries}
                                >
                                  {delet => {
                                    const deleteAndClose = () => {
                                      delet({ variables: { id: voter.id } });
                                      this.hideDeletePersonConfirmation();
                                    };
                                    return (
                                      <ConfirmModal
                                        confirmAction={deleteAndClose}
                                        closeAction={
                                          this.hideDeletePersonConfirmation
                                        }
                                        header={
                                          <Trans>
                                            census.deletePersonConfirmationModalTitle
                                          </Trans>
                                        }
                                        body={
                                          <Trans
                                            values={{
                                              personName:
                                                voter.person.firstName +
                                                ' ' +
                                                voter.person.lastName,
                                              pollbookName:
                                                pollBookDict[voter.pollbookId]
                                                  .name[lang],
                                            }}
                                          >
                                            census.deletePersonConfirmationModalText
                                          </Trans>
                                        }
                                        confirmText={
                                          <Trans>general.delete</Trans>
                                        }
                                        closeText={
                                          <Trans>general.cancel</Trans>
                                        }
                                      />
                                    );
                                  }}
                                </Mutation>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        );
                      } else {
                        return (
                          <TableRow key={index} actionTextOnHover={true}>
                            <TableCell>
                              <Text>
                                {voter.person.firstName +
                                  ' ' +
                                  voter.person.lastName}
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
                                  action={this.showUpdateVoterForm.bind(
                                    this,
                                    voter.id
                                  )}
                                >
                                  <Trans>general.edit</Trans>
                                </ActionText>
                              </Text>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    })}
                  </TableBody>
                </Table>
              </PageSection>

              <ButtonContainer alignRight={true} topMargin={true}>
                <Button
                  text={
                    <span>
                      <Trans>election.goTo</Trans>&nbsp;
                      <Trans>election.electionStatus</Trans>
                    </span>
                  }
                  action={this.handleProceed}
                  iconRight="mainArrow"
                />
              </ButtonContainer>
              <PageSection>
                {this.state.showUploadCensusFileModal ? (
                  <UploadCensusFileModal
                    header={<Trans>census.uploadCensusFileHeader</Trans>}
                    closeAction={this.closeUploadCensusFileModal}
                    pollBooks={pollBookRadioButtonOptions}
                    groupId={this.props.groupId}
                    refetchData={refetch}
                  />
                ) : null}
              </PageSection>

              {this.state.proceed ? (
                <Redirect
                  to={`/admin/elections/${this.props.groupId}/status`}
                />
              ) : null}
            </Page>
          );
        }}
      </Query>
    );
  }
}

export default translate()(ElectionGroupCensuses);
