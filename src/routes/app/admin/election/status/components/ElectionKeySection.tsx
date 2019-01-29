import * as React from 'react';

import { Trans } from 'react-i18next';
import { withApollo, WithApolloClient } from 'react-apollo';
import gql from 'graphql-tag';

import { getCryptoEngine } from 'cryptoEngines';
import Button, { ButtonContainer } from 'components/button';
import Modal from 'components/modal';
import { InfoList, InfoListItem } from 'components/infolist';
import { PageSection } from 'components/page';
import Text from 'components/text';
import Link from 'components/link';
import CreateNewElectionKeyModal from './CreateNewElectionKeyModal';

const createElectionKey = gql`
  mutation CreateElectionGroupKey($id: UUID!, $key: String!) {
    createElectionGroupKey(id: $id, key: $key) {
      ok
    }
  }
`;

interface IKeyPair {
  publicKey: string;
  secretKey: string;
}

interface IProps {
  electionGroup: ElectionGroup;
  replaceKey: boolean;
  classes: any;
}

type PropsInternal = WithApolloClient<IProps>;

interface IState {
  publicKey: string;
  secretKey: string;
  showCreateKeyModal: boolean;
  showConfirmNewKeyModal: boolean;
  isWorking: boolean;
  swsGenerateKeyPair: SubtaskWorkingState;
  swsActivatePublicKey: SubtaskWorkingState;
  subtaskError: string;
}

class CreateElectionKey extends React.Component<PropsInternal, IState> {
  cryptoEngine: any;
  hasErorredOut = false;

  constructor(props: PropsInternal) {
    super(props);
    this.state = {
      publicKey: '',
      secretKey: '',
      showCreateKeyModal: false,
      showConfirmNewKeyModal: false,
      isWorking: false,
      swsGenerateKeyPair: SubtaskWorkingState.notStarted,
      swsActivatePublicKey: SubtaskWorkingState.notStarted,
      subtaskError: '',
    };
    this.cryptoEngine = getCryptoEngine();
  }

  showCreateKeyModal = () => {
    if (!this.state.isWorking) {
      this.generateAndActivateNewKey();
      this.setState({
        isWorking: true,
      });
    }
    this.setState({
      showCreateKeyModal: true,
    });
  };

  closeCreateKeyModal = () => {
    this.setState({
      secretKey: '',
      showCreateKeyModal: false,
    });
  };

  showCreateNewKeyModal = () => {
    this.setState({
      showConfirmNewKeyModal: true,
    });
  };

  cancelNewKey = () => {
    this.setState({
      showConfirmNewKeyModal: false,
    });
  };

  confirmNewKey = () => {
    this.setState({
      showConfirmNewKeyModal: false,
    });
    this.showCreateKeyModal();
  };

  generateAndActivateNewKey = async () => {
    this.hasErorredOut = false;
    this.setState({
      swsGenerateKeyPair: SubtaskWorkingState.working,
      swsActivatePublicKey: SubtaskWorkingState.notStarted,
    });
    let keys: IKeyPair = { secretKey: '', publicKey: '' };
    try {
      // await new Promise(resolve => setTimeout(resolve, 1000));
      keys = await this.cryptoEngine.generateKeyPair();
    } catch (error) {
      this.hasErorredOut = true;
      this.setState({
        isWorking: false,
        swsGenerateKeyPair: SubtaskWorkingState.failed,
        subtaskError:
          'Noe gikk galt under generering av nøkkelpar.\nFeilmelding: ' + error,
      });
    }
    if (!this.hasErorredOut) {
      this.setState({
        secretKey: keys.secretKey,
        publicKey: keys.publicKey,
        swsGenerateKeyPair: SubtaskWorkingState.done,
        swsActivatePublicKey: SubtaskWorkingState.working,
      });
      try {
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // const t0 = performance.now();
        await this.props.client.mutate({
          mutation: createElectionKey,
          variables: { id: this.props.electionGroup.id, key: keys.publicKey },
          refetchQueries: ['electionGroup'],
          awaitRefetchQueries: true,
        });
        // const t1 = performance.now();
        // console.error("Call to mutate took " + (t1 - t0) + " milliseconds.")
      } catch (error) {
        this.hasErorredOut = true;
        this.setState({
          isWorking: false,
          swsActivatePublicKey: SubtaskWorkingState.failed,
          subtaskError:
            'Noe gikk galt under opplasting og aktivering av offentlig nøkkel. Sjekk internett-tilkoblingen, lukk dialogboksen og prøv på nytt.\nFeilmelding: ' +
            error,
        });
      }
      if (!this.hasErorredOut) {
        this.setState({
          swsActivatePublicKey: SubtaskWorkingState.done,
          isWorking: false,
        });
      }
    }
  };

  render() {
    const { electionGroup } = this.props;
    const hasKey = electionGroup.publicKey !== null;
    const status = electionGroup.status;

    return (
      <>
        <PageSection header={<Trans>election.electionKey</Trans>}>
          {!hasKey ? (
            <>
              <ButtonContainer alignLeft smlTopMargin>
                <Button
                  text={<Trans>election.electionKeyCreate</Trans>}
                  action={this.showCreateKeyModal}
                />
              </ButtonContainer>
              <Text marginTop>
                <Trans>election.electionKeyMissing</Trans>
              </Text>
            </>
          ) : (
            <>
              <Text marginBottom>
                {/* <Trans>election.electionKeyExists</Trans> */}
                Valgnøkkel ble opprettet av [brukernavn] [dato] kl
                [klokkeslett].
              </Text>
              <InfoList>
                <InfoListItem bulleted key="keep-it-safe">
                  <Trans>election.electionKeyStatusKeepItSafe</Trans>
                </InfoListItem>
                <InfoListItem bulleted key="can-replace">
                  <Trans>election.electionKeyStatusCanReplace</Trans>
                </InfoListItem>
                <InfoListItem bulleted key="read-more">
                  <Link external to="#TODO">
                    <Trans>election.electionKeyReadMore</Trans>
                  </Link>
                </InfoListItem>
              </InfoList>
              {(status === 'draft' || status === 'announced') && (
                <ButtonContainer alignLeft smlTopMargin>
                  <Button
                    text={<Trans>election.electionKeyCreateNew</Trans>}
                    action={this.showCreateNewKeyModal}
                    secondary
                  />
                </ButtonContainer>
              )}
              <Text marginTop>
                {status === 'published' && (
                  <Trans>election.electionKeyCannotCreateReasonPublished</Trans>
                )}
                {(status === 'ongoing' ||
                  status === 'closed' ||
                  status === 'multipleStatuses') && (
                  <Trans>
                    election.electionKeyCannotCreateReasonHasStarted
                  </Trans>
                )}
                {status === 'cancelled' && (
                  <Trans>election.electionCancelled</Trans>
                )}
              </Text>
            </>
          )}
        </PageSection>
        {this.state.showConfirmNewKeyModal && (
          <Modal
            header={<Trans>election.electionKeyConfirmNewModalHeader</Trans>}
            closeAction={this.cancelNewKey}
            buttons={[
              <Button
                text={<Trans>general.yes</Trans>}
                action={this.confirmNewKey}
                key="confirm-button"
              />,
              <Button
                secondary
                text={<Trans>general.no</Trans>}
                action={this.cancelNewKey}
                key="cancel-button"
              />,
            ]}
          >
            <Text>
              <Trans>election.electionKeyConfirmNewModalText</Trans>
            </Text>
          </Modal>
        )}
        {this.state.showCreateKeyModal && (
          <CreateNewElectionKeyModal
            secretKey={this.state.secretKey}
            publicKey={this.state.publicKey}
            isWorking={this.state.isWorking}
            swsGenerateKeyPair={this.state.swsGenerateKeyPair}
            swsActivatePublicKey={this.state.swsActivatePublicKey}
            subtaskError={this.state.subtaskError}
            handleCloseModal={this.closeCreateKeyModal}
          />
        )}
      </>
    );
  }
}

export enum SubtaskWorkingState {
  notStarted,
  working,
  failed,
  done,
}

export default withApollo(CreateElectionKey);
