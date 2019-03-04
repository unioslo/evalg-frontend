import * as React from 'react';

import Text from 'components/text';
import { Trans } from 'react-i18next';
import Button, { ButtonContainer } from 'components/button'
// import { PageSubSection } from 'components/page';
import Modal from 'components/modal';
// import Icon from 'components/icon';

const renderPublishButton = (action) => (
  <Button
    key="publish"
    text={<Trans>election.publish</Trans>}
    action={action}
  />
);

const renderUnpublishButton = (action) => (
  <Button
    key="unpublish"
    text={<Trans>election.unpublishElection</Trans>}
    action={action}
  />
);

const renderCancelButton = (action) => (
  <Button
    key="cancel"
    text={<Trans>general.cancel</Trans>}
    action={action}
    secondary
  />
);

// const renderCloseButton = (action: Function) => (
//   <Button
//     key="finished"
//     text={ <Trans>general.close</Trans> }
//     action={ action }
//     secondary
//   />
// );

// type Props = {
//   electionGroup: ElectionGroup,
//   publishAction: Function,
//   unpublishAction: Function
// }

// type State = {
//   showPublishModal: boolean,
//   showUnpublishModal: boolean,
// }


class PublishElectionGroup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showPublishModal: false,
      showUnpublishModal: false,
    };
  }

  showPublishModal() {
    this.setState({ showPublishModal: true })
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
          <Button text={<Trans>election.publishElection</Trans>}
            action={this.showPublishModal.bind(this)} />
        </ButtonContainer>
        {this.state.showPublishModal &&
          <Modal header={<Trans>election.publishElection</Trans>}
            buttons={[
              renderCancelButton(this.closePublishModal.bind(this)),
              renderPublishButton(this.handlePublish.bind(this))
            ]}
            closeAction={this.closePublishModal.bind(this)}>
            <Text>
              <Trans>election.publishElectionModalInfo</Trans>
            </Text>
          </Modal>
        }
      </div>
    )
  }

  showUnpublishModal() {
    this.setState({ showUnpublishModal: true })
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
          <Button text={<Trans>election.unpublishElection</Trans>}
            action={this.showUnpublishModal.bind(this)}
            secondary />
        </ButtonContainer>
        {this.state.showUnpublishModal &&
          <Modal header={<Trans>election.unpublishElection</Trans>}
            buttons={[
              renderCancelButton(this.closeUnpublishModal.bind(this)),
              renderUnpublishButton(this.handleUnpublish.bind(this))
            ]}
            closeAction={this.closeUnpublishModal.bind(this)}>
            <Text>
              <Trans>election.unpublishElectionModalInfo</Trans>
            </Text>
          </Modal>
        }
      </div>
    )
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
