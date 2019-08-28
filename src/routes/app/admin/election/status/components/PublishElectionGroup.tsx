import React from 'react';
import { Trans } from 'react-i18next';

import Text from 'components/text';
import Button, { ButtonContainer } from 'components/button';
import Modal from 'components/modal';
import { ElectionGroup } from 'interfaces';

const renderPublishButton = (action: any) => (
  <Button
    key="publish"
    text={<Trans>election.publish</Trans>}
    action={action}
  />
);

const renderUnpublishButton = (action: any) => (
  <Button
    key="unpublish"
    text={<Trans>election.unpublishElection</Trans>}
    action={action}
  />
);

const renderCancelButton = (action: any) => (
  <Button
    key="cancel"
    text={<Trans>general.cancel</Trans>}
    action={action}
    secondary
  />
);

interface IProps {
  electionGroup: ElectionGroup;
  publishAction: Function;
  unpublishAction: Function;
}

interface IState {
  showPublishModal: boolean;
  showUnpublishModal: boolean;
}

class PublishElectionGroup extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showPublishModal: false,
      showUnpublishModal: false,
    };
  }

  showPublishModal() {
    this.setState({ showPublishModal: true });
  }

  closePublishModal() {
    this.setState({ showPublishModal: false });
  }

  handlePublish() {
    this.props.publishAction(this.props.electionGroup.id);
    this.closePublishModal();
  }

  renderPublish() {
    return (
      <div>
        <ButtonContainer alignLeft smlTopMargin>
          <Button
            text={<Trans>election.publishElection</Trans>}
            action={this.showPublishModal.bind(this)}
          />
        </ButtonContainer>
        {this.state.showPublishModal && (
          <Modal
            header={<Trans>election.publishElection</Trans>}
            buttons={[
              renderCancelButton(this.closePublishModal.bind(this)),
              renderPublishButton(this.handlePublish.bind(this)),
            ]}
            closeAction={this.closePublishModal.bind(this)}
            hideTopCloseButton
          >
            <Text>
              <Trans>election.publishElectionModalInfo</Trans>
            </Text>
          </Modal>
        )}
      </div>
    );
  }

  showUnpublishModal() {
    this.setState({ showUnpublishModal: true });
  }

  closeUnpublishModal() {
    this.setState({ showUnpublishModal: false });
  }

  handleUnpublish() {
    this.props.unpublishAction(this.props.electionGroup.id);
    this.closeUnpublishModal();
  }

  renderUnpublish() {
    return (
      <div>
        <ButtonContainer alignLeft smlTopMargin>
          <Button
            text={<Trans>election.unpublishElection</Trans>}
            action={this.showUnpublishModal.bind(this)}
            secondary
          />
        </ButtonContainer>
        {this.state.showUnpublishModal && (
          <Modal
            header={<Trans>election.unpublishElection</Trans>}
            buttons={[
              renderCancelButton(this.closeUnpublishModal.bind(this)),
              renderUnpublishButton(this.handleUnpublish.bind(this)),
            ]}
            closeAction={this.closeUnpublishModal.bind(this)}
            hideTopCloseButton
          >
            <Text>
              <Trans>election.unpublishElectionModalInfo</Trans>
            </Text>
          </Modal>
        )}
      </div>
    );
  }

  render() {
    const { electionGroup } = this.props;
    return (
      <span>
        {!electionGroup.published && this.renderPublish()}
        {electionGroup.published && this.renderUnpublish()}
      </span>
    );
  }
}

export default PublishElectionGroup;
