/* @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import { Trans } from 'react-i18next';

import Modal from 'components/modal';
import Button from 'components/button'
import Text from 'components/text';
import Link from 'components/link';
import ActionText from 'components/actiontext';

const renderAnnounceButton = (action: Function) => (
  <Button
    key="announce"
    text={<Trans>election.announceElectionConfirm</Trans>}
    action={action}
  />
);

const renderUnannounceButton = (action: Function) => (
  <Button
    key="unannounce"
    text={<Trans>election.unannounceElectionConfirm</Trans>}
    action={action}
  />
);

const renderCancelButton = (action: Function) => (
  <Button
    key="cancel"
    text={<Trans>general.cancel</Trans>}
    action={action}
    secondary
  />
);

type Props = {
  electionGroup: ElectionGroup,
};

type State = {
  showConfirmAnnounceModal: boolean,
  showConfirmUnannounceModal: boolean,
  showAnnounceModal: boolean,
  showUnannounceModal: boolean,
};


class AnnounceElectionGroup extends React.Component {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      showAnnounceModal: false,
      showUnannounceModal: false,
      showConfirmAnnounceModal: false,
      showConfirmUnannounceModal: false,
    };
  }
  closeAnnounceModal() {
    this.setState({
      showAnnounceModal: false
    });
  }
  showConfirmAnnounceDialog() {
    this.setState({ showConfirmAnnounceModal: true })
  }
  closeConfirmAnnounceDialog() {
    this.setState({ showConfirmAnnounceModal: false })
  }
  handleAnnounce() {
    this.props.announceElectionGroup(this.props.electionGroup.id).then(
      () => this.props.getAdminElectionGroupElections(this.props.electionGroup.id)
    );
    this.setState({
      showAnnounceModal: true,
      showConfirmAnnounceModal: false
    });
  }
  renderAnnounce() {
    return (
      <span>
        <ActionText action={this.showConfirmAnnounceDialog.bind(this)} bottom>
          <Trans>election.statusDoAnnounce</Trans>
        </ActionText>
        {this.state.showConfirmAnnounceModal &&
          <Modal header={<Trans>election.announceElectionHeader</Trans>}
            buttons={[
              renderCancelButton(this.closeConfirmAnnounceDialog.bind(this)),
              renderAnnounceButton(this.handleAnnounce.bind(this))
            ]}
            closeAction={this.closeConfirmAnnounceDialog.bind(this)}>
            <p><Text>
              <Trans>election.announceElectionInfoOne</Trans>
            </Text></p>
            <p><Text>
              <Trans>election.announceElectionInfoTwo</Trans>
            </Text></p>
            <p><Text>
              <Link external to="#TODO">
                <Trans>election.announceElectionReadMore</Trans>
              </Link>
            </Text></p>
          </Modal>
        }
      </span>
    )
  }
  closeUnannounceModal() {
    this.setState({
      showUnannounceModal: false
    });
  }
  showConfirmUnannounceDialog() {
    this.setState({ showConfirmUnannounceModal: true })
  }
  closeConfirmUnannounceDialog() {
    this.setState({ showConfirmUnannounceModal: false })
  }
  handleUnannounce() {
    this.props.unannounceElectionGroup(this.props.electionGroup.id).then(
      () => this.props.getAdminElectionGroupElections(this.props.electionGroup.id)
    );
    this.setState({
      showUnannounceModal: true,
      showConfirmUnannounceModal: false
    });
  }
  renderUnannounce() {
    return (
      <span>
        <ActionText action={this.showConfirmUnannounceDialog.bind(this)} bottom>
          <Trans>election.statusDoUnannounce</Trans>
        </ActionText>
        {this.state.showConfirmUnannounceModal &&
          <Modal header={<Trans>election.unannounceElectionHeader</Trans>}
            buttons={[
              renderCancelButton(this.closeConfirmAnnounceDialog.bind(this)),
              renderUnannounceButton(this.handleUnannounce.bind(this))
            ]}
            closeAction={this.closeConfirmUnannounceDialog.bind(this)}>
            <p><Text>
              <Trans>election.unannounceElectionInfoOne</Trans>
            </Text></p>
            <p><Text>
              <Trans>election.unannounceElectionInfoTwo</Trans>
            </Text></p>
            <p><Text>
              <Link external to="#TODO">
                <Trans>election.announceElectionReadMore</Trans>
              </Link>
            </Text></p>
          </Modal>
        }
      </span>
    )
  }
  render() {
    const { electionGroup } = this.props;
    return (
      <span>
        {!electionGroup.announced && this.renderAnnounce()}
        {electionGroup.announced && this.renderUnannounce()}
      </span>
    );
  }
}

export default AnnounceElectionGroup;
