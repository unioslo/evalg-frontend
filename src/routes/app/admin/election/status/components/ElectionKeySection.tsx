import React from 'react';
import { Trans } from 'react-i18next';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import Button, { ButtonContainer } from 'components/button';
import Modal from 'components/modal';
import { InfoList, InfoListItem } from 'components/infolist';
import { PageSection } from 'components/page';
import Text from 'components/text';
import Link from 'components/link';
import { ElectionGroup } from 'interfaces';

import CreateElectionKeyModal from './CreateElectionKeyModal';
import ElectionKeyCreatedByInfo from './ElectionKeyCreatedByInfo';

const styles = (theme: any) => ({
  externalLink: {
    color: theme.linkExternalColor,
  },
});

const setKeySafeStatuses = ['draft', 'announced'];

interface IProps {
  electionGroup: ElectionGroup;
  refetchElectionGroupFunction: () => Promise<any>;
  classes: Classes;
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

  handleCloseCreateKeyModal = () => {
    this.setState({
      showCreateKeyModal: false,
    });
    this.props.refetchElectionGroupFunction();
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
    const { electionGroup, classes } = this.props;
    const hasKey = electionGroup.publicKey !== null;
    const status = electionGroup.status;

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
                <Trans>admin.electionKey.createdBy</Trans>{' '}
                <ElectionKeyCreatedByInfo electionGroupId={electionGroup.id} />
                <br />
                <Trans>admin.electionKey.publicKeyCaption</Trans>:{' '}
                <span>
                  {this.state.showPublicKey ? electionGroup.publicKey : null}{' '}
                  <a
                    className={classes.externalLink}
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      this.setState(currState => ({
                        showPublicKey: !currState.showPublicKey,
                      }));
                    }}
                  >
                    {this.state.showPublicKey ? (
                      <Trans>general.hide</Trans>
                    ) : (
                      <Trans>general.show</Trans>
                    )}
                  </a>
                </span>
              </Text>
              <InfoList>
                <InfoListItem bulleted key="keep-it-safe">
                  <Trans>admin.electionKey.infoListKeepItSafe</Trans>
                </InfoListItem>
                <InfoListItem bulleted key="can-replace">
                  <Trans>admin.electionKey.infoListCanReplace</Trans>
                </InfoListItem>
                <InfoListItem bulleted key="read-more">
                  <Link external to="#TODO">
                    <Trans>admin.electionKey.readMore</Trans>
                  </Link>
                </InfoListItem>
              </InfoList>
              {setKeySafeStatuses.indexOf(status) >= 0 ? (
                <ButtonContainer alignLeft smlTopMargin>
                  <Button
                    text={<Trans>admin.electionKey.createNew</Trans>}
                    action={this.showConfirmNewKeyModal}
                    secondary
                  />
                </ButtonContainer>
              ) : (
                <Text marginTop>
                  <Trans>
                    admin.electionKey.cannotReplaceBecauseUnsafeStatus
                  </Trans>
                </Text>
              )}
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
            electionGroup={this.props.electionGroup}
            onCloseModal={this.handleCloseCreateKeyModal}
            isReplacingOldKey={hasKey}
          />
        )}
      </>
    );
  }
}

export default injectSheet(styles)(ElectionKeySection);
