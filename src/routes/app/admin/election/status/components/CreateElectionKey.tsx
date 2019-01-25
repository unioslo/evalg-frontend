import * as React from 'react';

import { Trans } from 'react-i18next';

import { getCryptoEngine } from 'cryptoEngines';
import Button, { ButtonContainer } from 'components/button';
import { PageSubSection } from 'components/page';
import Modal from 'components/modal';

import Icon from 'components/icon';
import injectSheet from 'react-jss';

const styles = (theme: any) => ({
  generatingSpinner: {
    display: 'inline-block',
    position: 'relative',
    top: '0.5rem',
    marginRight: '1rem',
    width: '2.5rem',
    height: '2.5rem',
    border: '3px solid rgba(0,0,0,.3)',
    borderRadius: '50%',
    borderTopColor: '#000',
    animation: 'spin 0.8s linear infinite',
    '-webkit-animation': 'spin 0.8s linear infinite',
  },

  '@keyframes spin': {
    to: { '-webkit-transform': 'rotate(360deg)' },
  },
});

interface IKeyPair {
  publicKey: string;
  secretKey: string;
}

interface IProps {
  electionGroup: ElectionGroup;
  createAction: (electionGroupId: string, publicKey: string) => void;
  classes: any;
}

interface IState {
  publicKey: string;
  secretKey: string;
  showSaveKeyModal: boolean;
  isGeneratingKeyPair: boolean;
}

class CreateElectionKey extends React.Component<IProps, IState> {
  cryptoEngine: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      publicKey: '',
      secretKey: '',
      showSaveKeyModal: false,
      isGeneratingKeyPair: false,
    };
    this.cryptoEngine = getCryptoEngine();
  }

  showSaveKeyModal = () => {
    if (!this.state.isGeneratingKeyPair) {
      this.handleKeyGeneration();
    }
    this.setState({
      showSaveKeyModal: true,
    });
  };

  closeSaveKeyModal = () => {
    this.setState({
      secretKey: '',
      showSaveKeyModal: false,
    });
  };

  handleKeyGeneration = async () => {
    this.setState({ isGeneratingKeyPair: true });
    const keys: IKeyPair = await this.cryptoEngine.generateKeyPair();
    this.setState({
      publicKey: keys.publicKey,
      secretKey: keys.secretKey,
      isGeneratingKeyPair: false,
    });
  };

  handleKeySave = () => {
    this.props.createAction(this.props.electionGroup.id, this.state.publicKey);
    this.closeSaveKeyModal();
  };

  render() {
    return (
      <div>
        <ButtonContainer alignLeft smlTopMargin>
          <Button
            text={<Trans>election.electionKeyCreate</Trans>}
            action={this.showSaveKeyModal}
          />
        </ButtonContainer>
        {this.state.showSaveKeyModal && (
          <Modal
            header={<Trans>election.electionKey</Trans>}
            closeAction={this.closeSaveKeyModal}
            buttons={[
              <Button
                key="finished"
                text={<Trans>general.close</Trans>}
                action={this.closeSaveKeyModal}
                secondary={true}
              />,
              <Button
                key="publish"
                text={<Trans>election.electionKeySave</Trans>}
                action={this.handleKeySave}
                disabled={this.state.isGeneratingKeyPair}
              />,
            ]}
          >
            <p>
              Valgnøkkelen er nødvendig for å kunne telle opp stemmene når
              valget er avsluttet. Lagre filen med nøkkelen et sikkert sted hvor
              uvedkommende ikke har tilgang. Uten nøkkelen kan ikke stemmene
              telles opp.
            </p>
            <p>
              <strong>
                Når denne dialogen blir lukket, vil det IKKE være mulig å få tak
                i nøkkelen igjen.
              </strong>
            </p>
            <PageSubSection header={<Trans>election.electionKey</Trans>}>
              {this.state.isGeneratingKeyPair ? (
                <>
                  <div className={this.props.classes.generatingSpinner} />
                  <span>
                    <Trans>election.electionKeyGenerating</Trans>...
                  </span>
                </>
              ) : (
                <>
                  <p>{this.state.secretKey}</p>
                  <ButtonContainer alignLeft smlTopMargin>
                    <a
                      href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                        this.state.secretKey
                      )}`}
                      key="download"
                      className="button button-primary"
                      download="electionKey.txt"
                    >
                      <Trans>general.save</Trans>
                      <span className="button--icon-smlmargin">
                        <Icon type="save" />
                      </span>
                    </a>
                  </ButtonContainer>
                </>
              )}
            </PageSubSection>
          </Modal>
        )}
      </div>
    );
  }
}

export default injectSheet(styles)(CreateElectionKey);
