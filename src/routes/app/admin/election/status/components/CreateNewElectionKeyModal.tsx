import React from 'react';
import { Trans } from 'react-i18next';
import injectSheet from 'react-jss';

import Modal from 'components/modal';
import Icon from 'components/icon';
import { SubtaskWorkingState } from './ElectionKeySection';
import Button, { ButtonContainer } from 'components/button';
import { InfoList, InfoListItem } from 'components/infolist';
import { Form, Field } from 'react-final-form';
import { CheckBoxRF } from 'components/form';

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

  importantInfoHeader: {
    marginTop: '3rem',
    marginBottom: '1rem',
  },

  buttonAnchorWrapper: {
    '&:hover': {
      textDecoration: 'none',
    },
  },

  checkBoxFieldsGrid: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    justifyContent: 'start',
    margin: '3rem 0',
    rowGap: '1rem',
  },
  closeButtonAndFormValidationGrid: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    columnGap: '2rem',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

interface IProps {
  secretKey: string;
  publicKey: string;
  isWorking: boolean;
  swsGenerateKeyPair: SubtaskWorkingState;
  swsActivatePublicKey: SubtaskWorkingState;
  subtaskError: string | null;
  handleCloseModal: () => void;
  classes: any;
}

interface IState {
  showDetails: boolean;
}

class CreateNewElectionKeyModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showDetails: false,
    };
  }

  render() {
    const {
      secretKey,
      publicKey,
      isWorking,
      swsGenerateKeyPair,
      swsActivatePublicKey,
      subtaskError,
      handleCloseModal,
      classes,
    } = this.props;

    return (
      <Modal
        header={<Trans>election.electionKeyCreate</Trans>}
        closeAction={handleCloseModal}
        hideButtons
      >
        <>
          <div className={classes.workingStateGrid}>
            <SubtaskWorkingStateIcon workingState={swsGenerateKeyPair} />
            <p>Genererer nøkkelpar</p>
            <SubtaskWorkingStateIcon workingState={swsActivatePublicKey} />
            <p>Laster opp og aktiverer offentlig nøkkel</p>
          </div>
          {subtaskError && (
            <p className={classes.errorMessage}>{subtaskError}</p>
          )}
          <div className={classes.keyPairDetails}>
            {this.state.showDetails && (
              <>
                <div className={classes.keyPairGrid}>
                  <p className="rowCaption">
                    Hemmelig dekrypteringsnøkkel (valgnøkkel):
                  </p>
                  <p>{secretKey}</p>
                  <p className="rowCaption">Offentlig krypteringsnøkkel:</p>
                  <p>{publicKey}</p>
                  <p className="rowCaption">Opprettet av:</p>
                  <p>[ikke implementert]</p>
                  <p className="rowCaption">Tidspunkt opprettet:</p>
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
              {this.state.showDetails ? 'Skjul detailer' : 'Vis detailer'}
            </a>
          </div>

          <ButtonContainer center smlTopMargin>
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
                disabled={isWorking || subtaskError}
                text="Lagre valgnøkkel"
              />
            </a>
          </ButtonContainer>

          <p className={classes.importantInfoHeader}>Viktig informasjon:</p>
          <InfoList>
            <InfoListItem bulleted>
              Lagre filen med valgnøkkelen ved å trykke på knappen over. Lagre
              filen på et sikkert sted hvor uvedkommende ikke har tilgang.
            </InfoListItem>
            <InfoListItem bulleted>
              Du må ta vare på valgnøkkelen frem til stemmene skal telles opp.{' '}
              <strong>
                Uten valgnøkkelen er det ikke mulig å telle opp stemmene
              </strong>
              , da stemmene ikke vil kunne dekrypteres. Vi anbefaler at du tar
              en sikkerhetskopi av valgnøkkel-filen.
            </InfoListItem>
            <InfoListItem bulleted>
              <strong>
                Når du lukker denne dialogboksen, vil det IKKE være mulig å få
                tak i valgnøkkelen igjen.
              </strong>
              &nbsp;Frem til valget starter kan du imidlertid generere en ny
              valgnøkkel som erstatter den gamle.
            </InfoListItem>
            <InfoListItem bulleted>
              Du kan endre filnavnet, men du må ikke endre innholdet i
              valgnøkkelfilen.
            </InfoListItem>
          </InfoList>

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
                <div className={classes.checkBoxFieldsGrid}>
                  <Field
                    name="firstCheck"
                    component={CheckBoxRF}
                    type="checkbox"
                  />
                  <span>
                    Jeg har lagret filen med valgnøkkelen på et trygt sted.
                  </span>
                  <Field
                    name="secondCheck"
                    component={CheckBoxRF}
                    type="checkbox"
                  />
                  <span>
                    Jeg forstår at valgnøkkelen ikke kan hentes etter at jeg
                    lukker denne dialogboksen, og at valget ikke kan telles opp
                    uten valgnøkkelen.
                  </span>
                </div>
                <div className={classes.closeButtonAndFormValidationGrid}>
                  <Button secondary action={handleSubmit} text="Lukk" />
                  {!valid &&
                    ((touched as any).firstCheck || // To make the message come up when clicking the close button
                      (touched as any).secondCheck) && (
                      <span className={classes.checkboxFormValidationError}>
                        Du må krysse av boksene over før du kan trykke «Lukk».
                      </span>
                    )}
                </div>
              </form>
            )}
          </Form>
        </>
      </Modal>
    );
  }
}

export default injectSheet(styles)(CreateNewElectionKeyModal);

const subtaskWorkingStateIconStyles = (theme: any) => ({
  iconContainer: {
    width: '2.2rem',
    height: '2.2rem',
  },
  iconContainerWithOffset: {
    width: '2.2rem',
    height: '2.2rem',
    position: 'relative',
    top: '-0.2rem',
  },
  generatingSpinner: {
    width: '2.2rem',
    height: '2.2rem',
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

interface IsubtaskWorkingStateIconProps {
  workingState: SubtaskWorkingState;
  classes: any;
}

const SubtaskWorkingStateIcon = injectSheet(subtaskWorkingStateIconStyles)(
  ({ workingState, classes }: IsubtaskWorkingStateIconProps) => (
    <>
      {workingState === SubtaskWorkingState.notStarted && (
        <div className={classes.iconContainer} />
      )}
      {workingState === SubtaskWorkingState.working && (
        <div className={classes.iconContainer}>
          <div className={classes.generatingSpinner} />
        </div>
      )}
      {workingState === SubtaskWorkingState.failed && (
        <div className={classes.iconContainerWithOffset}>
          <Icon type="xMark" />
        </div>
      )}
      {workingState === SubtaskWorkingState.done && (
        <div className={classes.iconContainerWithOffset}>
          <Icon type="checkMark" />
        </div>
      )}
    </>
  )
);
