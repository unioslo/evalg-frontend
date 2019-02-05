import React from 'react';
import { Trans, translate, TranslationFunction } from 'react-i18next';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import { Form } from 'react-final-form';
import gql from 'graphql-tag';
import { withApollo, WithApolloClient } from 'react-apollo';

import Modal from 'components/modal';
// import Icon from 'components/icon';
import Button, { ButtonContainer } from 'components/button';
import { InfoList, InfoListItem } from 'components/infolist';
import Link from 'components/link';
import { CheckBox } from 'components/form';
import { getCryptoEngine } from 'cryptoEngines';

const styles = (theme: any) => ({
  workingStateGrid: {
    display: 'grid',
    gridTemplateColumns: '3.3rem auto',
    gridTemplateRows: 'auto auto',
    margin: '2.5rem 0 1.7rem 0',
    alignItems: 'center',
    gridRowGap: '1rem',
    '& p': {
      margin: 0,
    },
  },

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

  keyPairDetails: {
    marginBottom: '2rem',
    '& .toggleDetailsLink': {
      color: theme.colors.blueish,
    },
  },
  keyPairGrid: {
    marginTop: '2rem',
    marginBottom: '1.2rem',
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    gridTemplateRows: 'auto auto auto auto',
    justifyContent: 'start',
    columnGap: '2rem',
    rowGap: '0.5rem',
    '& p': {
      margin: 0,
    },
    '& .rowCaption': {
      textDecoration: 'bold',
    },
  },

  errorMessage: {
    whiteSpace: 'pre-line',
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

  importantInfoHeader: {
    marginTop: '3rem',
    marginBottom: '1rem',
  },

  buttonAnchorWrapper: {
    '&:hover': {
      textDecoration: 'none',
    },
  },

  // checkBoxFieldsGrid: {
  //   display: 'grid',
  //   gridTemplateColumns: 'auto auto',
  //   justifyContent: 'start',
  //   margin: '3rem 0',
  //   rowGap: '1rem',
  // },
  closeButtonAndFormValidationGrid: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    columnGap: '2rem',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  checkbox1: boolean;
  checkbox2: boolean;
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
      checkbox1: false,
      checkbox2: true,
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
      isAllowedToActivateKey: currState.hasDownloadedKey && currState.checkbox1,
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
      checkbox1,
      isAllowedToActivateKey,
      errorMessage,
    } = this.state;

    return (
      <Modal
        header={<Trans>election.electionKeyCreate</Trans>}
        closeAction={handleCloseModal}
        hideButtons
      >
        <>
          {/* <pre>
            <code>{JSON.stringify(this.state, null, 2)}</code>
          </pre> */}

          {errorMessage && (
            <p className={classes.errorMessage}>{errorMessage}</p>
          )}

          {/* <p className={classes.importantInfoHeader}>
            <Trans>election.createElectionKeyModalInfoListHeader</Trans>
          </p> */}
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
                Mer informasjon og tips
              </Link>
            </InfoListItem>
          </InfoList>

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
                  `${secretKey}
${publicKey}
created-by
created-date`
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
                        <span>Generer valgnøkkel</span>
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
                      checkbox1: !currState.checkbox1,
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
                      <span>Aktiverer valgnøkkel</span>
                      <div className={classes.workingSpinner} />
                    </>
                  ) : (
                    'Aktiver valgnøkkel'
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

          {/* <div className={classes.keyPairDetails}>
            {showDetails && (
              <>
                <div className={classes.keyPairGrid}>
                  <p className="rowCaption">
                    <Trans>
                      election.createElectionKeyModalDetailsSecretKey
                    </Trans>
                    :
                  </p>
                  <p>{secretKey}</p>
                  <p className="rowCaption">
                    <Trans>
                      election.createElectionKeyModalDetailsPublicKey
                    </Trans>
                    :
                  </p>
                  <p>{publicKey}</p>
                  <p className="rowCaption">
                    <Trans>
                      election.createElectionKeyModalDetailsCreatedBy
                    </Trans>
                    :
                  </p>
                  <p>[ikke implementert]</p>
                  <p className="rowCaption">
                    <Trans>
                      election.createElectionKeyModalDetailsTimeCreated
                    </Trans>
                    :
                  </p>
                  <p>[ikke implementert]</p>
                </div>
              </>
            )}
            <a
              className="toggleDetailsLink"
              onClick={() =>
                this.setState(currState => ({
                  showDetails: !currState.showDetails,
                }))
              }
            >
              {showDetails
                ? 'Skjul nøkkelpar'
                : 'Vis nøkkelpar'}
            </a>
          </div> */}

          <Form
            onSubmit={handleCloseModal}
            validate={(values: any) => {
              const errors: any = {};
              if (!values.firstCheck) {
                errors.firstCheck = 'required';
              }
              if (!values.secondCheck) {
                errors.secondCheck = 'required';
              }
              return errors;
            }}
          >
            {({ handleSubmit, errors, valid, touched }) => (
              <form onSubmit={handleSubmit}>
                {/* <pre>
                      <code>{JSON.stringify(errors, null, 2)}</code>
                    </pre> */}
                {/* <Field
                  name="firstCheck"
                  component={CheckBoxRF}
                  type="checkbox"
                  label={
                    <>
                      <span>2. </span>
                      <Trans>
                        election.createElectionKeyModalCheckboxLabel1
                      </Trans>
                    </>
                  }
                />
                <Field
                  name="secondCheck"
                  component={CheckBoxRF}
                  type="checkbox"
                  label={
                    <>
                      <span>3. </span>
                      <Trans>
                        election.createElectionKeyModalCheckboxLabel2
                      </Trans>
                    </>
                  }
                /> */}

                {/* <div className={classes.closeButtonAndFormValidationGrid}>
                  <Button
                    secondary
                    action={handleSubmit}
                    text={t('general.close')}
                  />
                  {!valid &&
                    ((touched as any).firstCheck || // To make the message come up when clicking the close button
                      (touched as any).secondCheck) && (
                      <span className={classes.checkboxFormValidationError}>
                        <Trans>
                          election.createElectionKeyModalCheckboxesValidationError
                        </Trans>
                      </span>
                    )}
                </div> */}
              </form>
            )}
          </Form>
        </>
      </Modal>
    );
  }
}

// const subtaskWorkingStateIconStyles = (theme: any) => ({
//   iconContainer: {
//     width: '2.2rem',
//     height: '2.2rem',
//   },
//   iconContainerWithOffset: {
//     width: '2.2rem',
//     height: '2.2rem',
//     position: 'relative',
//     top: '-0.2rem',
//   },
//   generatingSpinner: {
//     width: '2.2rem',
//     height: '2.2rem',
//     border: '3px solid rgba(0,0,0,.3)',
//     borderRadius: '50%',
//     borderTopColor: '#000',
//     animation: 'spin 0.8s linear infinite',
//     '-webkit-animation': 'spin 0.8s linear infinite',
//   },
//   '@keyframes spin': {
//     to: { '-webkit-transform': 'rotate(360deg)' },
//   },
// });

// interface IsubtaskWorkingStateIconProps {
//   workingState: SubtaskWorkingState;
//   classes: any;
// }

// const SubtaskWorkingStateIcon = injectSheet(subtaskWorkingStateIconStyles)(
//   ({ workingState, classes }: IsubtaskWorkingStateIconProps) => (
//     <>
//       {workingState === SubtaskWorkingState.notStarted && (
//         <div className={classes.iconContainer} />
//       )}
//       {workingState === SubtaskWorkingState.working && (
//         <div className={classes.iconContainer}>
//           <div className={classes.generatingSpinner} />
//         </div>
//       )}
//       {workingState === SubtaskWorkingState.failed && (
//         <div className={classes.iconContainerWithOffset}>
//           <Icon type="xMark" />
//         </div>
//       )}
//       {workingState === SubtaskWorkingState.done && (
//         <div className={classes.iconContainerWithOffset}>
//           <Icon type="checkMark" />
//         </div>
//       )}
//     </>
//   )
// );

export default injectSheet(styles)(
  translate()(withApollo(CreateElectionKeyModal))
);
