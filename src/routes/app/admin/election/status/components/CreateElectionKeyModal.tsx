import React from 'react';
import { Trans, translate, TranslationFunction } from 'react-i18next';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import gql from 'graphql-tag';
import { withApollo, WithApolloClient } from 'react-apollo';

import { IMutationResponse } from '../../../../../../interfaces';

import { sleep, translateBackendError } from '../../../../../../utils';
import { getCryptoEngine } from '../../../../../../cryptoEngines';
import Modal from '../../../../../../components/modal';
import Button, { ButtonContainer } from '../../../../../../components/button';
import { InfoList, InfoListItem } from '../../../../../../components/infolist';
import Link from '../../../../../../components/link';
import { CheckBox } from '../../../../../../components/form';

const styles = (theme: any) => ({
  steps: {
    margin: '4rem auto',
    width: '60rem',
  },

  stepRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '3.5rem',
  },

  stepNumber: {
    width: '5.5rem',
    height: '5.5rem',
    flexShrink: 0,
    marginRight: '6rem',
    fontSize: '4rem',
    fontWeight: 'bold',
    color: theme.colors.lightGray,
    textAlign: 'center',
    border: '2px solid',
    borderRadius: '50%',
    paddingTop: '3px',
    '&.active': {
      color: theme.colors.darkTurquoise,
    },
  },

  errorMessage: {
    whiteSpace: 'pre-line',
    color: theme.colors.darkRed,
  },

  workingSpinner: {
    position: 'relative',
    top: -5,
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

  infoList: {
    maxWidth: '100rem',
  },

  buttonAnchorWrapper: {
    '&:hover': {
      textDecoration: 'none',
    },
  },

  animatedCheckmarkSvg: {
    position: 'relative',
    top: '-22px',
    marginRight: '-13px',

    '& .checkmarkPath': {
      strokeWidth: 5,
      stroke: 'white',
      strokeMiterlimit: 10,
      strokeDasharray: 48,
      strokeDashoffset: 48,
      animation: 'stroke .4s cubic-bezier(0.650, 0.000, 0.450, 1.000) forwards',
    },
  },
  '@keyframes stroke': {
    '100%': {
      strokeDashoffset: 0,
    },
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

interface IKeyPair {
  publicKey: string;
  secretKey: string;
}

interface IProps {
  electionGroupId: string;
  isReplacingOldKey: boolean;
  onCloseModal: () => void;
  t: TranslationFunction;
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
  errorMessage: string | null;
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
      const t = this.props.t;
      this.setState({ isGeneratingKey: false });
      this.showError(
        `${t('admin.errors.generateKeyError')}\n${t(
          'general.errorMessage'
        )}: ${error}`
      );
    }
  };

  showError = async (message: string) => {
    this.setState({
      errorMessage: message,
    });
  };

  activateKey = async () => {
    this.setState({
      isActivatingKey: true,
    });
    await this.props.client
      .mutate<ISetElectionGroupKeyResponse>({
        mutation: setElectionGroupKeyMutation,
        variables: {
          id: this.props.electionGroupId,
          publicKey: this.state.publicKey,
        },
      })
      .then(result => {
        const response =
          result && result.data && result.data.setElectionGroupKey;

        if (!response || response.success === false) {
          let errorMessage = this.props.t(
            'admin.errors.activateKeyErrorGeneral'
          );
          if (response && response.code) {
            errorMessage = translateBackendError(response.code, this.props.t);
          }
          this.setState({ isActivatingKey: false });
          this.showError(errorMessage);
        } else {
          this.keyActivated();
        }
      })
      .catch(error => {
        this.setState({ isActivatingKey: false });
        this.showError(this.props.t('admin.errors.activateKeyErrorGeneral'));
      });
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
    const { isReplacingOldKey, onCloseModal, t, classes } = this.props;

    const {
      publicKey,
      secretKey,
      isGeneratingKey,
      isActivatingKey,
      hasDownloadedKey,
      isCheckboxChecked,
      isAllowedToActivateKey,
      hasActivatedNewKey,
      errorMessage,
    } = this.state;

    const errorMessageValue = errorMessage ? true : false;

    const electionKeyFileContents = `
secret:${secretKey}
public:${publicKey}`.trim();

    const animatedCheckmarkSvg = (
      <svg
        className={classes.animatedCheckmarkSvg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52 52"
        width="56"
        height="56"
      >
        <path
          className="checkmarkPath"
          fill="none"
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
        />
      </svg>
    );

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
        {animatedCheckmarkSvg}
      </>
    ) : isReplacingOldKey ? (
      <Trans>admin.electionKey.modalActivateNew</Trans>
    ) : (
      <Trans>admin.electionKey.modalActivate</Trans>
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
          <div className={classes.infoList}>
            <InfoList>
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
          </div>

          <div className={classes.steps}>
            <div className={classes.stepRow}>
              <div
                className={classNames({
                  [classes.stepNumber]: true,
                  active: !isGeneratingKey,
                })}
              >
                1
              </div>
              <ButtonContainer center noTopMargin>
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                    electionKeyFileContents
                  )}`}
                  key="download"
                  className={classes.buttonAnchorWrapper}
                  download="electionKey.txt"
                >
                  <Button
                    action={() =>
                      this.setState(
                        { hasDownloadedKey: true },
                        this.checkIfAllowedToActivateKey
                      )
                    }
                    disabled={isGeneratingKey || errorMessageValue}
                    text={downloadKeyButtonContent}
                  />
                </a>
              </ButtonContainer>
            </div>

            <div className={classes.stepRow}>
              <div
                className={classNames({
                  [classes.stepNumber]: true,
                  ['active']: hasDownloadedKey,
                })}
              >
                2
              </div>
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
            </div>

            <div className={classes.stepRow}>
              <div
                className={classNames({
                  [classes.stepNumber]: true,
                  active: isAllowedToActivateKey,
                })}
              >
                3
              </div>
              <ButtonContainer center noTopMargin>
                <Button
                  text={activateKeyButtonContent}
                  disabled={
                    !isAllowedToActivateKey ||
                    isGeneratingKey ||
                    isActivatingKey ||
                    hasActivatedNewKey ||
                    errorMessageValue
                  }
                  action={this.activateKey}
                />
              </ButtonContainer>
            </div>
          </div>

          {errorMessage && (
            <p className={classes.errorMessage}>{errorMessage}</p>
          )}
        </>
      </Modal>
    );
  }
}

export default injectSheet(styles)(
  translate()(withApollo(CreateElectionKeyModal))
);
