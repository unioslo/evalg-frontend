import gql from 'graphql-tag';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { Field, Form } from 'react-final-form';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';

import { orderMultipleElections } from '../../../../../utils/processGraphQLData';
import ActionText from '../../../../../components/actiontext';
import Button, {
  ActionButton,
  ButtonContainer,
} from '../../../../../components/button';
import { DropDownRF, FormButtons } from '../../../../../components/form';
import Link from '../../../../../components/link';
import { MsgBox } from '../../../../../components/msgbox';
import { ConfirmModal } from '../../../../../components/modal';
import { Page, PageSection } from '../../../../../components/page';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from '../../../../../components/table';
import Text from '../../../../../components/text';
import { Redirect } from 'react-router';
import UploadCensusFileModal, {
  IUploadCensusFileModalStatus,
} from './components/UploadCensusFile';

import { DropDownOption, Election, IVoter } from '../../../../../interfaces';
import { getVoterIdTypeDisplayName } from '../../../../../utils/i18n';
import {
  VoterGroupActionPanel,
  VoterGroupActionPanelContainer,
} from '../components/VoterGroupActionsPanel';
import AddVoterForm from './components/AddVoterForm';

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
    # TODO (backend): Denne sletter voters med manual=true også, og det vil vi nok ikke
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
            idType
            idValue
            verified
            manual
          }
        }
      }
    }
  }
`;

// const addVoter = gql`
//   mutation addVoter($personId: UUID!, $pollbookId: UUID!) {
//     addVoter(personId: $personId, pollbookId: $pollbookId) {
//       ok
//     }
//   }
// `;

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

interface IProps extends WithTranslation {
  groupId: string;
}

interface IState {
  pollBookId: string;
  showAddVoterPollbookId: string;
  updateVoterId: string;
  showDeleteVoter: boolean;
  showDeletePollbook: boolean;
  deleteVotersPollbookId: string;
  proceed: boolean;
  showUploadCensusFileModal: boolean;
  showUploadMsgBox: boolean;
  uploadMsg: string | React.ReactNode;
  addVoterFeedback: string;
}

class ElectionGroupCensuses extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      pollBookId: '',
      showAddVoterPollbookId: '',
      showDeletePollbook: false,
      showDeleteVoter: false,
      deleteVotersPollbookId: '',
      updateVoterId: '',
      proceed: false,
      showUploadCensusFileModal: false,
      showUploadMsgBox: false,
      uploadMsg: '',
      addVoterFeedback: '',
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

  addVoterFormRef: React.RefObject<any> = React.createRef();

  showNewVoterForm(pollbookId: string) {
    this.closeUpdateVoterForm();
    this.setState({ showAddVoterPollbookId: pollbookId });
  }

  showDeleteVotersInPollbookModal(pollbookId: string) {
    this.closeNewVoterForm();
    this.closeUpdateVoterForm();
    this.setState({
      showDeletePollbook: true,
      deleteVotersPollbookId: pollbookId,
    });
  }

  closeNewVoterForm() {
    this.setState({ showAddVoterPollbookId: '' });
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
    this.closeNewVoterForm();
    this.setState({ updateVoterId: voterId });
  }

  closeUpdateVoterForm() {
    this.setState({ updateVoterId: '' });
  }

  handleProceed = () => {
    this.setState({ proceed: true });
  };

  showMessageBox(msg: any) {
    this.setState({
      showUploadMsgBox: true,
      uploadMsg: msg,
    });
  }

  showUploadCensusFileModal() {
    this.closeUpdateVoterForm();

    this.setState({
      showUploadCensusFileModal: true,
      showUploadMsgBox: false,
    });
  }

  closeUploadCensusFileModal(result: IUploadCensusFileModalStatus) {
    this.setState({
      showUploadCensusFileModal: false,
    });

    if (result.message) {
      this.showMessageBox(result.message);
    }
  }

  render() {
    const { t, i18n } = this.props;
    const lang = i18n.language;

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
          const pollBookDict: any = {};
          const pollBookOptions: DropDownOption[] = [];
          const pollBookRadioButtonOptions: any = {};

          elections
            .filter(e => e.active)
            .forEach((e: Election) => {
              e.pollbooks.forEach((pollBook: any) => {
                pollBookDict[pollBook.id] = pollBook;
                pollBook.voters
                  .filter((v: any) => v.verified)
                  .forEach((voter: any) => {
                    voters.push(voter);
                  });
                pollBookOptions.push({
                  name: pollBook.name[lang],
                  value: pollBook.id,
                });
                pollBookRadioButtonOptions[pollBook.id] = {
                  name: pollBook.name,
                  value: pollBook.id,
                  active: e.active,
                };
              });
            });
          const voterGroupActionPanels: JSX.Element[] = [];
          elections.forEach((e, index) => {
            e.pollbooks.forEach((pollbook: any, i: any) => {
              voterGroupActionPanels.push(
                <VoterGroupActionPanel
                  voterGroupName={pollbook.name[lang]}
                  addAction={this.showNewVoterForm.bind(this, pollbook.id)}
                  addActionText={t('census.addPerson')}
                  removeAllAction={this.showDeleteVotersInPollbookModal.bind(
                    this,
                    pollbook.id
                  )}
                  removeAllActionText={t('census.deletePersonsInPollbook')}
                  count={pollbook.voters.filter((v: any) => v.verified).length}
                  active={e.active}
                />
              );
            });
          });
          return (
            <Page header={<Trans>election.censuses</Trans>}>
              <PageSection noBorder desc={<Trans>census.censusPageDesc</Trans>}>
                <div
                  onClick={this.showUploadCensusFileModal}
                  style={{ marginBottom: '1.2rem' }}
                >
                  <ActionButton text={t('census.uploadCensusFileButton')} />
                </div>

                <Link
                  external
                  to="https://www.uio.no/for-ansatte/arbeidsstotte/arrangere-valg/"
                >
                  <Trans>census.aboutCensusFiles</Trans>
                </Link>
              </PageSection>
              <PageSection noBorder header={<Trans>election.census</Trans>}>
                <VoterGroupActionPanelContainer>
                  {voterGroupActionPanels}
                </VoterGroupActionPanelContainer>

                {this.state.showUploadMsgBox && (
                  <MsgBox msg={this.state.uploadMsg} timeout={true} />
                )}

                {this.state.showDeletePollbook && (
                  <Mutation
                    mutation={deleteVotersInPollbook}
                    refetchQueries={refetchQueries}
                  >
                    {del => {
                      const deletePollbookAndClose = () => {
                        del({
                          variables: {
                            id: this.state.deleteVotersPollbookId,
                          },
                        });
                        this.hideDeletePollbookConfirmation();
                        this.closeNewVoterForm();
                      };
                      return (
                        <ConfirmModal
                          confirmAction={deletePollbookAndClose}
                          closeAction={this.hideDeletePollbookConfirmation}
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
                                    this.state.deleteVotersPollbookId
                                  ].voters.length,
                                of: t(
                                  pollBookDict[
                                    this.state.deleteVotersPollbookId
                                  ].voters.length === 1
                                    ? 'census.person'
                                    : 'census.persons'
                                ).toLowerCase(),
                                pollbookName:
                                  pollBookDict[
                                    this.state.deleteVotersPollbookId
                                  ].name[lang],
                              }}
                            >
                              census.deletePollbookConfirmationModalText
                            </Trans>
                          }
                          confirmText={<Trans>general.delete</Trans>}
                          closeText={<Trans>general.cancel</Trans>}
                        />
                      );
                    }}
                  </Mutation>
                )}

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
                    {this.state.showAddVoterPollbookId && (
                      <AddVoterForm
                        pollbook={
                          pollBookDict[this.state.showAddVoterPollbookId]
                        }
                        onClose={this.closeNewVoterForm}
                        t={t}
                        lang={lang}
                      />
                    )}

                    {voters.map((voter, index) => {
                      if (voter.id === this.state.updateVoterId) {
                        return (
                          <TableRow key={voter.id} verticalPadding={true}>
                            <TableCell topPadding verticalAlignTop>
                              <Text>
                                {getVoterIdTypeDisplayName(voter.idType, t)}
                              </Text>
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
                              {this.state.showDeleteVoter && (
                                <Mutation
                                  mutation={deleteVoter}
                                  refetchQueries={refetchQueries}
                                >
                                  {del => {
                                    const deleteAndClose = () => {
                                      del({ variables: { id: voter.id } });
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
                                              idType: getVoterIdTypeDisplayName(
                                                voter.idType,
                                                t
                                              ).toLowerCase(),
                                              idValue: voter.idValue,
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
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      } else {
                        return (
                          <TableRow key={voter.id} actionTextOnHover={true}>
                            <TableCell>
                              <Text>
                                {getVoterIdTypeDisplayName(voter.idType, t)}
                              </Text>
                            </TableCell>
                            <TableCell>
                              <Text>{voter.idValue}</Text>
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

              <ButtonContainer alignRight={true} noTopMargin={false}>
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

              {this.state.showUploadCensusFileModal && (
                <UploadCensusFileModal
                  header={<Trans>census.uploadCensusFileHeader</Trans>}
                  closeAction={this.closeUploadCensusFileModal}
                  pollBooks={pollBookRadioButtonOptions}
                  groupId={this.props.groupId}
                  refetchData={refetch}
                />
              )}

              {this.state.proceed && (
                <Redirect
                  to={`/admin/elections/${this.props.groupId}/status`}
                />
              )}
            </Page>
          );
        }}
      </Query>
    );
  }
}

export default withTranslation()(ElectionGroupCensuses);
