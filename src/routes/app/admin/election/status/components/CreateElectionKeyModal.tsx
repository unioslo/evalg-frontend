import React from 'react';
import { Trans, translate, TranslationFunction } from 'react-i18next';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import gql from 'graphql-tag';
import { withApollo, WithApolloClient } from 'react-apollo';

import Modal from 'components/modal';
import Button, { ButtonContainer } from 'components/button';
import { InfoList, InfoListItem } from 'components/infolist';
import Link from 'components/link';
import { CheckBox } from 'components/form';
import { getCryptoEngine } from 'cryptoEngines';

const styles = (theme: any) => ({
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    gridRowGap: '3.5rem',
    gridColumnGap: '5rem',
    justifyItems: 'start',
    alignItems: 'center',
    margin: '4rem auto',
    width: '60rem',
  },

  stepNumber: {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: theme.colors.lightGray,
    textAlign: 'center',
    border: '2px solid',
    borderRadius: '50%',
    width: '5.5rem',
    height: '5.5rem',
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
    border: '3px solid rgba(255,255,255,.3)',
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
});

const createElectionKey = gql`
  mutation CreateElectionGroupKey($id: UUID!, $key: String!) {
    createElectionGroupKey(id: $id, key: $key) {
      ok
    }
  }
`;

interface IKeyPair {
  publicKey: string;
  secretKey: string;
}

interface IProps {
  electionGroupId: string;
  handleCloseModal: () => void;
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
      this.setState({
        isGeneratingKey: false,
        errorMessage:
          'Noe gikk galt under generering av nøkkelpar.\nFeilmelding: ' + error,
      });
    }
  };

  activateKey = async () => {
    this.setState({
      isActivatingKey: true,
    });
    try {
      await this.props.client.mutate({
        mutation: createElectionKey,
        variables: {
          id: this.props.electionGroupId,
          key: this.state.publicKey,
        },
        refetchQueries: ['electionGroup'],
        awaitRefetchQueries: true,
      });
      this.setState({ secretKey: '', isActivatingKey: false });
      this.props.handleCloseModal();
    } catch (error) {
      this.setState({
        isActivatingKey: false,
        errorMessage:
          'Noe gikk galt under opplasting og aktivering av offentlig nøkkel. Sjekk internett-tilkoblingen, lukk dialogboksen og prøv på nytt.\nFeilmelding: ' +
          error,
      });
    }
  };

  render() {
    const { handleCloseModal, t, classes } = this.props;

    const {
      publicKey,
      secretKey,
      isGeneratingKey,
      isActivatingKey,
      hasDownloadedKey,
      isCheckboxChecked: checkbox1,
      isAllowedToActivateKey,
      errorMessage,
    } = this.state;

    return (
      <Modal
        header={<Trans>election.electionKeyCreate</Trans>}
        closeAction={handleCloseModal}
        hideTopCloseButton
        buttons={[
          <Button
            key="cancel-button"
            text={<Trans>general.cancel</Trans>}
            action={handleCloseModal}
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
                    __html: t('election.createElectionKeyModalInfoBullet2'),
                  }}
                />
              </InfoListItem>
              <InfoListItem bulleted>
                <span
                  dangerouslySetInnerHTML={{
                    __html: t('election.createElectionKeyModalInfoBullet3'),
                  }}
                />
              </InfoListItem>
              <InfoListItem bulleted>
                <Link external to="#TODO">
                  <Trans>election.createElectionKeyModalMoreInfoLink</Trans>
                </Link>
              </InfoListItem>
            </InfoList>
          </div>

          <div className={classes.stepsGrid}>
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
                  `secret:${secretKey}
public:${publicKey}`
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
                  disabled={isGeneratingKey || errorMessage}
                  text={
                    isGeneratingKey ? (
                      <>
                        <Trans>election.createElectionKeyModalGenerating</Trans>
                        <div className={classes.workingSpinner} />
                      </>
                    ) : (
                      t('election.createElectionKeyModalSaveKeyFile')
                    )
                  }
                />
              </a>
            </ButtonContainer>

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
                value={checkbox1}
                label={
                  <Trans>election.createElectionKeyModalCheckboxLabel</Trans>
                }
                disabled={!hasDownloadedKey}
                onChange={() => null}
              />
            </div>

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
                text={
                  isActivatingKey ? (
                    <>
                      <Trans>election.createElectionKeyModalActivating</Trans>
                      <div className={classes.workingSpinner} />
                    </>
                  ) : (
                    <Trans>election.createElectionKeyModalActivate</Trans>
                  )
                }
                disabled={
                  !isAllowedToActivateKey ||
                  isGeneratingKey ||
                  isActivatingKey ||
                  errorMessage
                }
                action={this.activateKey}
              />
            </ButtonContainer>
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
