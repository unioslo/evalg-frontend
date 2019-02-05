import * as React from 'react';

import { Trans } from 'react-i18next';

import Button, { ButtonContainer } from 'components/button';
import Modal from 'components/modal';
import { InfoList, InfoListItem } from 'components/infolist';
import { PageSection } from 'components/page';
import Text from 'components/text';
import Link from 'components/link';
import CreateElectionKeyModal from './CreateElectionKeyModal';

interface IProps {
  electionGroup: ElectionGroup;
  replaceKey: boolean;
  classes: any;
}

interface IState {
  showCreateKeyModal: boolean;
  showConfirmNewKeyModal: boolean;
  showPublicKey: boolean;
}

class CreateElectionKey extends React.Component<IProps, IState> {
  cryptoEngine: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      showCreateKeyModal: false,
      showConfirmNewKeyModal: false,
      showPublicKey: false,
    };
  }

  showCreateKeyModal = () => {
    this.setState({
      showCreateKeyModal: true,
    });
  };

  closeCreateKeyModal = () => {
    this.setState({
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
                <Trans>election.electionKeyCreatedBy</Trans> [brukernavn] [dato]
                kl [klokkeslett].
              </Text>
              <InfoList>
                <InfoListItem bulleted key="public-key">
                  Offentlig nøkkel (ikke valgnøkkel):{' '}
                  {this.state.showPublicKey ? (
                    <span>
                      {electionGroup.publicKey}{' '}
                      <a
                        href="javascript:void(0);"
                        onClick={() => this.setState({ showPublicKey: false })}
                      >
                        Skjul
                      </a>
                    </span>
                  ) : (
                    <a
                      href="javascript:void(0);"
                      onClick={() => this.setState({ showPublicKey: true })}
                    >
                      Vis
                    </a>
                  )}
                </InfoListItem>
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
          <CreateElectionKeyModal
            electionGroupId={this.props.electionGroup.id}
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

export default CreateElectionKey;
