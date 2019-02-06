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

class ElectionKeySection extends React.Component<IProps, IState> {
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

  showConfirmNewKeyModal = () => {
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

    console.log(hasKey);

    return (
      <>
        <PageSection header={<Trans>election.electionKey</Trans>}>
          {!hasKey ? (
            <>
              <ButtonContainer alignLeft smlTopMargin>
                <Button
                  text={<Trans>admin.electionKey.create</Trans>}
                  action={this.showCreateKeyModal}
                />
              </ButtonContainer>
              <Text marginTop>
                <Trans>admin.electionKey.missing</Trans>
              </Text>
            </>
          ) : (
            <>
              <Text marginBottom>
                <Trans>admin.electionKey.createdBy</Trans> [brukernavn] [dato]
                kl [klokkeslett].<br />
                <Trans>admin.electionKey.publicKeyCaption</Trans>:{' '}
                  {this.state.showPublicKey ? (
                    <span>
                      {electionGroup.publicKey}{' '}
                      <a
                        href="javascript:void(0);"
                        onClick={() => this.setState({ showPublicKey: false })}
                      >
                        <Trans>general.hide</Trans>
                      </a>
                    </span>
                  ) : (
                    <a
                      href="javascript:void(0);"
                      onClick={() => this.setState({ showPublicKey: true })}
                    >
                      <Trans>general.show</Trans>
                    </a>
                  )}
              </Text>
              <InfoList>
                <InfoListItem bulleted key="keep-it-safe">
                  <Trans>admin.electionKey.statusKeepItSafe</Trans>
                </InfoListItem>
                <InfoListItem bulleted key="can-replace">
                  <Trans>admin.electionKey.statusCanReplace</Trans>
                </InfoListItem>
                <InfoListItem bulleted key="read-more">
                  <Link external to="#TODO">
                    <Trans>admin.electionKey.readMore</Trans>
                  </Link>
                </InfoListItem>
              </InfoList>
              {(status === 'draft' || status === 'announced') && (
                <ButtonContainer alignLeft smlTopMargin>
                  <Button
                    text={<Trans>admin.electionKey.createNew</Trans>}
                    action={this.showConfirmNewKeyModal}
                    secondary
                  />
                </ButtonContainer>
              )}
              <Text marginTop>
                {status === 'published' && (
                  <Trans>admin.electionKey.cannotCreateReasonPublished</Trans>
                )}
                {(status === 'ongoing' ||
                  status === 'closed' ||
                  status === 'multipleStatuses') && (
                  <Trans>admin.electionKey.cannotCreateReasonHasStarted</Trans>
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
            header={<Trans>admin.electionKey.confirmNewModalHeader</Trans>}
            hideTopCloseButton
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
            <div style={{ maxWidth: '100rem' }}>
              <Text>
                <Trans>admin.electionKey.confirmNewModalText</Trans>
              </Text>
            </div>
          </Modal>
        )}
        {this.state.showCreateKeyModal && (
          <CreateElectionKeyModal
            electionGroupId={this.props.electionGroup.id}
            handleCloseModal={this.closeCreateKeyModal}
            isReplacingOldKey={hasKey}
          />
        )}
      </>
    );
  }
}

export default ElectionKeySection;
