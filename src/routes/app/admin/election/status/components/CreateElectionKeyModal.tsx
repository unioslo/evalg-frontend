import React from 'react';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import injectSheet from 'react-jss';
import gql from 'graphql-tag';
import { withApollo, WithApolloClient } from 'react-apollo';
import FileSaver from 'file-saver';

import { sleep, translateBackendError } from 'utils';
import { getCryptoEngine, IKeyPair } from 'cryptoEngines';
import Modal from 'components/modal';
import Button, { ButtonContainer } from 'components/button';
import { InfoList, InfoListItem } from 'components/infolist';
import Link from 'components/link';
import { CheckBox } from 'components/form';
import AnimatedCheckmark from 'components/animations/AnimatedCheckmark';
import { IMutationResponse } from 'interfaces';

import ModalSteps from './ModalSteps';

const styles = (theme: any) => ({
  errorMessage: {
    whiteSpace: 'pre-line',
    color: theme.colors.darkRed,
  },

  workingSpinner: {
    position: 'relative',
    top: -1,
    marginLeft: 10,
    marginRight: -2,
    display: 'inline-block',
    width: '2.5rem',
    height: '2.5rem',
    border: '3px solid rgba(0, 0, 0, .3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 0.8s linear infinite',
    '-webkit-animation': 'spin 0.8s linear infinite',
  },
  '@keyframes spin': {
    to: { '-webkit-transform': 'rotate(360deg)' },
  },
});

const setElectionGroupKeyMutation = gql`
  mutation SetElectionGroupKey($id: UUID!, $publicKey: String!) {
    setElectionGroupKey(id: $id, publicKey: $publicKey) {
      success
      code
      message
    }
  }
`;

interface ISetElectionGroupKeyResponse {
  setElectionGroupKey: IMutationResponse;
}

interface IProps extends WithTranslation {
  electionGroupId: string;
  isReplacingOldKey: boolean;
  onCloseModal: () => void;
  classes: any;
}

type PropsInternal = WithApolloClient<IProps>;

interface IState {
  secretKey: string;
  publicKey: string;
  isGeneratingKey: boolean;
  isActivatingKey: boolean;
  hasDownloadedKey: boolean;
  isCheckboxChecked: boolean;
  isAllowedToActivateKey: boolean;
  hasActivatedNewKey: boolean;
  showDetails: boolean;
  errorMessage: string;
}

class CreateElectionKeyModal extends React.Component<PropsInternal, IState> {
  cryptoEngine: any;

  constructor(props: PropsInternal) {
    super(props);
    this.cryptoEngine = getCryptoEngine();

    this.state = {
      secretKey: '',
      publicKey: '',
      isGeneratingKey: false,
      isActivatingKey: false,
      hasDownloadedKey: false,
      isCheckboxChecked: false,
      isAllowedToActivateKey: false,
      hasActivatedNewKey: false,
      showDetails: false,
      errorMessage: '',
    };
  }

  componentDidMount() {
    this.generateElectionKey();
  }

  showError = async (errorMessage: string) => {
    this.setState({
      errorMessage,
    });
  };

  checkIfAllowedToActivateKey = () => {
    this.setState(currState => ({
      isAllowedToActivateKey:
        currState.hasDownloadedKey && currState.isCheckboxChecked,
    }));
  };

  generateElectionKey = async () => {
    let keys: IKeyPair = { secretKey: '', publicKey: '' };
    try {
      this.setState({
        isGeneratingKey: true,
      });
      keys = await this.cryptoEngine.generateKeyPair();
      this.setState({
        isGeneratingKey: false,
        secretKey: keys.secretKey,
        publicKey: keys.publicKey,
      });
    } catch (error) {
      const { t } = this.props;
      this.setState({ isGeneratingKey: false });
      this.showError(
        `${t('admin.electionKey.errors.generateKeyError')}\n${t(
          'errors.errorMessage'
        )}: ${error}`
      );
    }
  };

  downloadKeyFile = () => {
    const electionKeyFileContents = `
${this.state.secretKey}\r\nOffentlig nøkkel / Public key: ${
      // Using \r\n to make file look nice if opened in Notepad on Windows
      this.state.publicKey
    }`.trim();

    const blob = new Blob([electionKeyFileContents], {
      type: 'text/plain;charset=utf-8',
    });
    FileSaver.saveAs(blob, 'electionKey.txt');
    this.setState({ hasDownloadedKey: true }, this.checkIfAllowedToActivateKey);
  };

  activateKey = async () => {
    const { t } = this.props;

    this.setState({
      isActivatingKey: true,
    });

    let response;
    try {
      const result = await this.props.client.mutate<
        ISetElectionGroupKeyResponse
      >({
        mutation: setElectionGroupKeyMutation,
        variables: {
          id: this.props.electionGroupId,
          publicKey: this.state.publicKey,
        },
      });

      response = result && result.data && result.data.setElectionGroupKey;
    } catch (error) {
      this.setState({ isActivatingKey: false });
      this.showError(t('admin.electionKey.errors.backend.unknown'));
      return;
    }

    if (!response || response.success === false) {
      let errorMessage = t('admin.electionKey.errors.backend.unknown');
      if (response && response.code) {
        errorMessage = translateBackendError({
          errorCode: response.code,
          t: this.props.t,
          codePrefix: 'admin.electionKey.errors.backend',
        });
      }
      this.setState({ isActivatingKey: false });
      this.showError(errorMessage);
    } else {
      this.keyActivated();
    }
  };

  keyActivated = async () => {
    this.setState({
      secretKey: '',
      isActivatingKey: false,
      hasActivatedNewKey: true,
    });
    // Sleep while playing checkmark animation
    await sleep(1300);
    this.props.onCloseModal();
  };

  render() {
    const { isReplacingOldKey, onCloseModal, classes, t } = this.props;

    const {
      isGeneratingKey,
      isActivatingKey,
      hasDownloadedKey,
      isCheckboxChecked,
      isAllowedToActivateKey,
      hasActivatedNewKey,
      errorMessage,
    } = this.state;

    const downloadKeyButtonContent = isGeneratingKey ? (
      <>
        <Trans>admin.electionKey.modalGenerating</Trans>
        <div className={classes.workingSpinner} />
      </>
    ) : isReplacingOldKey ? (
      <Trans>admin.electionKey.modalDownloadNewKey</Trans>
    ) : (
      <Trans>admin.electionKey.modalDownloadKey</Trans>
    );

    const activateKeyButtonContent = isActivatingKey ? (
      <>
        <Trans>admin.electionKey.modalActivating</Trans>
        <div className={classes.workingSpinner} />
      </>
    ) : hasActivatedNewKey ? (
      <>
        <Trans>admin.electionKey.modalActivatedSuccessfully</Trans>
        <AnimatedCheckmark />
      </>
    ) : isReplacingOldKey ? (
      <Trans>admin.electionKey.modalActivateNew</Trans>
    ) : (
      <Trans>admin.electionKey.modalActivate</Trans>
    );

    const step1DownloadKeyButton = (
      <ButtonContainer center noTopMargin>
        <Button
          action={this.downloadKeyFile}
          disabled={isGeneratingKey || errorMessage !== ''}
          text={downloadKeyButtonContent}
        />
      </ButtonContainer>
    );

    const step2UnderstandCheckbox = (
      <div
        onClick={() => {
          if (hasDownloadedKey) {
            this.setState(
              currState => ({
                isCheckboxChecked: !currState.isCheckboxChecked,
              }),
              this.checkIfAllowedToActivateKey
            );
          }
        }}
      >
        <CheckBox
          value={isCheckboxChecked}
          label={<Trans>admin.electionKey.modalCheckboxLabel</Trans>}
          disabled={!hasDownloadedKey}
          onChange={() => null}
        />
      </div>
    );

    const step3ActivateKeyButton = (
      <ButtonContainer center noTopMargin>
        <Button
          text={activateKeyButtonContent}
          disabled={
            !isAllowedToActivateKey ||
            isGeneratingKey ||
            isActivatingKey ||
            hasActivatedNewKey ||
            errorMessage !== ''
          }
          action={this.activateKey}
        />
      </ButtonContainer>
    );

    return (
      <Modal
        header={
          isReplacingOldKey ? (
            <Trans>admin.electionKey.createNew</Trans>
          ) : (
            <Trans>admin.electionKey.create</Trans>
          )
        }
        closeAction={onCloseModal}
        hideTopCloseButton
        buttons={[
          <Button
            key="cancel-button"
            text={<Trans>general.cancel</Trans>}
            action={onCloseModal}
            secondary
          />,
        ]}
      >
        <>
          <InfoList maxWidth="100rem">
            <InfoListItem bulleted>
              <span
                dangerouslySetInnerHTML={{
                  __html: t('admin.electionKey.modalInfoBullet1'),
                }}
              />
            </InfoListItem>
            <InfoListItem bulleted>
              <span
                dangerouslySetInnerHTML={{
                  __html: t('admin.electionKey.modalInfoBullet2'),
                }}
              />
            </InfoListItem>
            <InfoListItem bulleted>
              <Link external to="#TODO">
                <Trans>admin.electionKey.modalMoreInfoLink</Trans>
              </Link>
            </InfoListItem>
          </InfoList>

          <ModalSteps
            width="60rem"
            stepsContent={[
              step1DownloadKeyButton,
              step2UnderstandCheckbox,
              step3ActivateKeyButton,
            ]}
            stepsActiveStatus={[
              !isGeneratingKey,
              hasDownloadedKey,
              isAllowedToActivateKey,
            ]}
          />

          {errorMessage && (
            <p className={classes.errorMessage}>{errorMessage}</p>
          )}
        </>
      </Modal>
    );
  }
}

export default injectSheet(styles)(
  withTranslation()(withApollo(CreateElectionKeyModal))
);
