import React from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import { Redirect } from 'react-router';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';

import Spinner from 'components/animations/Spinner';
import { orderMultipleElections } from 'utils/processGraphQLData';
import Button, { ActionButton, ButtonContainer } from 'components/button';
import Link from 'components/link';
import { MsgBox } from 'components/msgbox';
import { ConfirmModal } from 'components/modal';
import { Page, PageSection } from 'components/page';
import { ElectionGroupFields, ElectionFields } from 'fragments';
import { DropDownOption, Election, IPollBook } from 'interfaces';

import UploadCensusFileModal, {
  IUploadCensusFileModalStatus,
} from './components/UploadCensusFile';
import CensusSearchTable from './components/CensusSearchTable';
import UploadedCensusFileTable from './components/UploadedCensusFileTable';
import {
  VoterGroupActionPanel,
  VoterGroupActionPanelContainer,
} from '../components/VoterGroupActionsPanel';
import VoterCSVDumper from '../components/VoterCSVDumper';
import AddVoterForm from './components/AddVoterForm';
import { TableBody, Table } from 'components/table';

const deleteVotersInPollbook = gql`
  mutation DeleteVotersInPollBook($id: UUID!) {
    deleteVotersInPollbook(id: $id) {
      ok
    }
  }
`;

const electionGroupQuery = gql`
  ${ElectionGroupFields}
  ${ElectionFields}
  query electionGroupVoters($id: UUID!) {
    electionGroup(id: $id) {
      ...ElectionGroupFields
      elections {
        ...ElectionFields
        pollbooks {
          id
          name
          weight
          priority
          nrOfVoters
          censusFileImports {
            id
            fileName
            mimeType
            importResults
            initiatedAt
            finishedAt
            status
            pollbook {
              name
            }
          }
        }
      }
    }
  }
`;

const refetchQueries = () => ['electionGroupVoters'];

interface IProps extends WithTranslation {
  groupId: string;
}

interface IState {
  pollBookId: string;
  addVoterPollbookId: string;
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
  state = {
    pollBookId: '',
    addVoterPollbookId: '',
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

  handleShowAddVoterForm = (pollbookId: string) => {
    this.setState({ addVoterPollbookId: pollbookId });
  };

  handleCloseAddVoterForm = () => {
    this.setState({ addVoterPollbookId: '' });
  };

  handleShowDeleteVotersInPollbookModal = (pollbookId: string) => {
    this.handleCloseAddVoterForm();
    this.setState({
      deleteVotersPollbookId: pollbookId,
    });
  };

  handleHideDeleteVotersInPollbookModal = () => {
    this.setState({ deleteVotersPollbookId: '' });
  };

  handleProceed = () => {
    this.setState({ proceed: true });
  };

  showMessageBox = (msg: any) => {
    this.setState({
      showUploadMsgBox: true,
      uploadMsg: msg,
    });
  };

  showUploadCensusFileModal = () => {
    this.setState({
      showUploadCensusFileModal: true,
      showUploadMsgBox: false,
    });
  };

  closeUploadCensusFileModal = (result: IUploadCensusFileModalStatus) => {
    this.setState({
      showUploadCensusFileModal: false,
    });

    if (result.message) {
      this.showMessageBox(result.message);
    }
  };

  render() {
    const { t, i18n } = this.props;
    const lang = i18n.language;

    return (
      <Query
        query={electionGroupQuery}
        variables={{ id: this.props.groupId }}
        fetchPolicy="network-only"
      >
        {({ data, loading, error, refetch }) => {
          if (error) {
            return 'Error';
          }
          if (loading) {
            return (
              <Page header={t('election.censuses')}>
                <PageSection>
                  <Spinner size="2.2rem" darkStyle marginRight="1rem" />
                  <Trans>census.loading</Trans>
                </PageSection>
              </Page>
            );
          }

          const electionsRaw: Election[] = data.electionGroup.elections;
          const elections =
            data.electionGroup.type === 'multiple_elections'
              ? orderMultipleElections(electionsRaw)
              : electionsRaw;

          const pollBooks: IPollBook[] = [];
          const pollBookDict: { [pollbookId: string]: IPollBook } = {};
          const pollBookOptions: DropDownOption[] = [];
          const pollBookRadioButtonOptions: any = {};

          elections
            .filter(e => e.active)
            .forEach((e: Election) => {
              e.pollbooks.forEach(pollBook => {
                pollBooks.push(pollBook);
                pollBookDict[pollBook.id] = pollBook;
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
          elections.forEach(e => {
            e.pollbooks.forEach(pollbook => {
              voterGroupActionPanels.push(
                <VoterGroupActionPanel
                  key={pollbook.id}
                  voterGroupName={pollbook.name[lang]}
                  addAction={() => this.handleShowAddVoterForm(pollbook.id)}
                  addActionText={t('census.addPerson')}
                  removeAllAction={() =>
                    this.handleShowDeleteVotersInPollbookModal(pollbook.id)
                  }
                  removeAllActionText={t('census.deletePersonsInPollbook')}
                  count={pollbook.nrOfVoters}
                  active={e.active}
                />
              );
            });
          });

          return (
            <Page header={t('election.censuses')}>
              <PageSection noBorder desc={<Trans>census.censusPageDesc</Trans>}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <button
                    className="button-no-style"
                    onClick={this.showUploadCensusFileModal}
                  >
                    <ActionButton text={t('census.uploadCensusFileButton')} />
                  </button>
                </div>

                <Link
                  external
                  to="https://www.uio.no/tjenester/it/applikasjoner/e-valg/hjelp/manntall.html/"
                >
                  <Trans>census.aboutCensusFiles</Trans>
                </Link>
                {this.state.showUploadMsgBox && (
                  <MsgBox msg={this.state.uploadMsg} timeout={false} />
                )}
                <UploadedCensusFileTable pollbooks={pollBooks} />
              </PageSection>
              <PageSection noBorder>
                <VoterCSVDumper electionGroup={data.electionGroup} />
              </PageSection>

              <PageSection noBorder>
                <VoterGroupActionPanelContainer>
                  {voterGroupActionPanels}
                </VoterGroupActionPanelContainer>

                {!!this.state.addVoterPollbookId && (
                  <Table>
                    <TableBody>
                      <AddVoterForm
                        pollbook={pollBookDict[this.state.addVoterPollbookId]}
                        onClose={this.handleCloseAddVoterForm}
                      />
                    </TableBody>
                  </Table>
                )}
              </PageSection>

              <PageSection noBorder>
                <CensusSearchTable electionGroup={data.electionGroup} />
              </PageSection>

              <ButtonContainer alignRight>
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

              {!!this.state.deleteVotersPollbookId && (
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
                      this.handleHideDeleteVotersInPollbookModal();
                      this.handleCloseAddVoterForm();
                    };
                    const deletePollbook =
                      pollBookDict[this.state.deleteVotersPollbookId];
                    const deletePollbookNumberOfVoters =
                      deletePollbook.nrOfVoters;
                    return (
                      <ConfirmModal
                        confirmAction={deletePollbookAndClose}
                        closeAction={this.handleHideDeleteVotersInPollbookModal}
                        header={
                          <Trans>
                            census.deletePollbookConfirmationModalTitle
                          </Trans>
                        }
                        body={
                          <Trans
                            values={{
                              num: deletePollbookNumberOfVoters,
                              of: t(
                                deletePollbookNumberOfVoters === 1
                                  ? 'census.person'
                                  : 'census.persons'
                              ).toLowerCase(),
                              pollbookName: deletePollbook.name[lang],
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

              {this.state.proceed && (
                <Redirect
                  push
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
