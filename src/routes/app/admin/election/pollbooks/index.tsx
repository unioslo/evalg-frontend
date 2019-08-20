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
import { DropDownOption, Election, IPollBook, IVoter } from 'interfaces';

import UploadCensusFileModal, {
  IUploadCensusFileModalStatus,
} from './components/UploadCensusFile';
import CensusTable from './components/CensusTable';
import {
  VoterGroupActionPanel,
  VoterGroupActionPanelContainer,
} from '../components/VoterGroupActionsPanel';

const deleteVotersInPollbook = gql`
  mutation DeleteVotersInPollBook($id: UUID!) {
    # TODO (backend): Denne sletter voters med selfAdded=true også, og det vil vi nok ikke
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
            selfAdded
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
          const voters: IVoter[] = [];

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
                pollBook.voters
                  .filter(voter => voter.verified)
                  .forEach(voter => {
                    voters.push(voter);
                  });
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
                  count={
                    voters.filter(v => v.pollbookId === pollbook.id).length
                  }
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
                  to="https://www.uio.no/for-ansatte/arbeidsstotte/arrangere-valg/"
                >
                  <Trans>census.aboutCensusFiles</Trans>
                </Link>
              </PageSection>
              <PageSection noBorder>
                <VoterGroupActionPanelContainer>
                  {voterGroupActionPanels}
                </VoterGroupActionPanelContainer>

                {this.state.showUploadMsgBox && (
                  <MsgBox msg={this.state.uploadMsg} timeout={true} />
                )}

                <CensusTable
                  pollBooks={pollBooks}
                  pollBookDict={pollBookDict}
                  pollBookOptions={pollBookOptions}
                  voters={voters}
                  addVoterPollbookId={this.state.addVoterPollbookId}
                  onCloseAddVoterForm={this.handleCloseAddVoterForm}
                  t={t}
                  lang={lang}
                />
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
                      deletePollbook.voters.length;

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
