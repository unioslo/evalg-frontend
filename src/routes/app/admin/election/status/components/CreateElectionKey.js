/* @flow */
import * as React from 'react';

import { Trans } from 'react-i18next';

import { getCryptoEngine } from 'cryptoEngines';
import Button, { ButtonContainer } from 'components/button'
import { PageSubSection } from 'components/page';
import Modal from 'components/modal';

import Icon from 'components/icon';

const renderSaveButton = (action: Function) => (
  <Button
    key="publish"
    text={<Trans>election.electionKeySave</Trans>}
    action={action}
  />
);

//const renderCancelButton = (action: Function) => (
//  <Button
//    key="cancel"
//    text={ <Trans>general.cancel</Trans> }
//    action={ action }
//    secondary
//  />
//);

const renderCloseButton = (action: Function) => (
  <Button
    key="finished"
    text={<Trans>general.close</Trans>}
    action={action}
    secondary
  />
);

type Props = {
  electionGroup: ElectionGroup,
  createAction: Function
}

type State = {
  publicKey: string,
  secretKey: string,
  showSaveKeyModal: boolean
}


class CreateElectionKey extends React.Component {
  state: State;
  cryptoEngine: Object;

  constructor(props: Props) {
    super(props);
    this.state = {
      publicKey: '',
      secretKey: '',
      showSaveKeyModal: false,
    };
    this.cryptoEngine = getCryptoEngine();
  }
  showSaveKeyModal() {
    this.handleKeyGeneration();
    this.setState({
      showSaveKeyModal: true,
    });
  }
  closeSaveKeyModal() {
    this.setState({
      secretKey: '',
      showSaveKeyModal: false
    });
  }
  handleKeyGeneration() {
    const keys = this.cryptoEngine.generateKeyPair();
    this.setState({
      publicKey: keys.publicKey,
      secretKey: keys.secretKey,
    });
  };
  handleKeySave() {
    this.props.createAction(
      this.props.electionGroup.id,
      this.state.publicKey
    );
    this.closeSaveKeyModal();
  }
  render() {
    return (
      <div>
        <ButtonContainer alignLeft smlTopMargin>
          <Button text={<Trans>election.electionKeyCreate</Trans>}
            action={this.showSaveKeyModal.bind(this)} />
        </ButtonContainer>
        {this.state.showSaveKeyModal &&
          <Modal header={<Trans>election.electionKey</Trans>}
            closeAction={this.closeSaveKeyModal.bind(this)}
            buttons={[
              renderCloseButton(this.closeSaveKeyModal.bind(this)),
              renderSaveButton(this.handleKeySave.bind(this))
            ]}>
            <p>Valgnøkkelen er nødvendig for å kunne telle opp stemmene når valget er avsluttet. Lagre filen med nøkkelen et sikkert sted hvor uvedkommende ikke har tilgang. Uten nøkkelen kan ikke stemmene telles opp.</p>
            <p><strong>Når denne dialogen blir lukket, vil det IKKE være mulig å få tak i nøkkelen igjen.</strong></p>
            <PageSubSection header={<Trans>election.electionKey</Trans>}>
              <p>{this.state.secretKey}</p>
              <ButtonContainer alignLeft smlTopMargin>
                <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(this.state.secretKey)}`}
                  key="download"
                  className="button button-primary"
                  download="electionKey.txt" >
                  <Trans>general.save</Trans>
                  <span className="button--icon-smlmargin">
                    <Icon type="save" />
                  </span>
                </a>
              </ButtonContainer>
            </PageSubSection>
          </Modal>
        }
      </div>
    )
  }
}

export default CreateElectionKey;
