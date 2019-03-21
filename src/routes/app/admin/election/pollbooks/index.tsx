import gql from 'graphql-tag';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';

import { orderMultipleElections } from '../../../../../utils/processGraphQLData';
import Button, {
  ActionButton,
  ButtonContainer,
} from '../../../../../components/button';
import Link from '../../../../../components/link';
import { MsgBox } from '../../../../../components/msgbox';
import { ConfirmModal } from '../../../../../components/modal';
import { Page, PageSection } from '../../../../../components/page';
import { Redirect } from 'react-router';
import UploadCensusFileModal, {
  IUploadCensusFileModalStatus,
} from './components/UploadCensusFile';

import {
  DropDownOption,
  Election,
  IVoter,
  IPollBook,
} from '../../../../../interfaces';
import {
  VoterGroupActionPanel,
  VoterGroupActionPanelContainer,
} from '../components/VoterGroupActionsPanel';
import CensusTable from './components/CensusTable';

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

          const pollBooks: IPollBook[] = [];
          const voters: IVoter[] = [];
          const pollBookDict: { [pollbookId: string]: IPollBook } = {};
          const pollBookOptions: DropDownOption[] = [];
          const pollBookRadioButtonOptions: any = {};

          elections
            .filter(e => e.active)
            .forEach((e: Election) => {
              e.pollbooks.forEach(pollBook => {
                pollBooks.push(pollBook);
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
              <PageSection noBorder>
                <VoterGroupActionPanelContainer>
                  {voterGroupActionPanels}
                </VoterGroupActionPanelContainer>

                {this.state.showUploadMsgBox && (
                  <MsgBox msg={this.state.uploadMsg} timeout={true} />
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
                          closeAction={
                            this.handleHideDeleteVotersInPollbookModal
                          }
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

                <CensusTable
                  pollBooks={pollBooks}
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
