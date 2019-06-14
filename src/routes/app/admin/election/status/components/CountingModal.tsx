import React, { useState } from 'react';
import gql from 'graphql-tag';
import { ApolloConsumer } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { useTranslation } from 'react-i18next';
import injectSheet from 'react-jss';
import { Classes } from 'jss';
import classNames from 'classnames';

import Button from 'components/button';
import Modal from 'components/modal';
import { InfoList, InfoListItem } from 'components/infolist';
import ElectionKeyCreatedByInfo from './ElectionKeyCreatedByInfo';
import Spinner from 'components/animations/Spinner';
import AnimatedCheckmark from 'components/animations/AnimatedCheckmark';
import { ElectionGroup, IMutationResponse } from 'interfaces';
import { translateBackendError } from 'utils';

import ModalSteps from './ModalSteps';

const ELECTION_KEY_FROM_FILE_LENGTH = 44;

const startElectionGroupCount = gql`
  mutation startElectionGroupCount($id: UUID!, $electionKey: String!) {
    startElectionGroupCount(id: $id, electionKey: $electionKey) {
      success
      code
      message
    }
  }
`;

const styles = (theme: any) => ({
  hiddenFileInput: {
    width: '0.1px',
    height: '0.1px',
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1,
  },
  fileInputLabelStyledAsButton: {
    backgroundImage:
      'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="%23FFF" %3E%3Cpath d="M10 20h8v-6h4l-8-8-8 8h4zm-5 0v6h18v-6h-3v3h-12v-3z" /%3E%3C/svg%3E\')',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top 9px right 15px',
    padding: '0 5.1rem 0 2rem',
    borderRadius: '0.4rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    height: '5rem',
    fontSize: '1.8rem',
    lineHeight: 0.9,
    backgroundColor: theme.primaryBtnBgColor,
    color: theme.primaryBtnColor,
  },
  '.hiddenFileInput:focus + .fileInputLabelStyledAsButton': {
    borderColor: theme.colors.lightTurquoise,
  },
  fileInputLabelStyledAsButtonDisabled: {
    cursor: 'default',
    backgroundColor: theme.btnDefDisabledColor,
    backgroundImage: 'none',
    paddingRight: '2rem',
  },
  inputLabelAndFileName: {
    display: 'flex',
    alignItems: 'center',
  },
  electionKeyFileName: {
    marginLeft: '2rem',
  },
  errorMessage: {
    color: theme.colors.darkRed,
  },
});

interface IStartElectionGroupCount {
  startElectionGroupCount: IMutationResponse;
}

interface Props {
  electionGroup: ElectionGroup;
  onCancelModal: () => void;
  onCloseModalAndSeeResults: () => void;
  classes: Classes;
}

const CountingModal: React.FunctionComponent<Props> = ({
  electionGroup,
  onCancelModal,
  onCloseModalAndSeeResults,
  classes,
}) => {
  const { t } = useTranslation();
  const [electionKey, setElectionKey] = useState('');
  const [electionKeyFileName, setElectionKeyFileName] = useState('');
  const [isReadingElectionKeyFile, setIsReadingElectionKeyFile] = useState(
    false
  );
  const [isElectionKeyReady, setIsElectionKeyReady] = useState(false);
  const [isElectionKeyError, setIsElectionKeyError] = useState(false);
  const [isCounting, setIsCounting] = useState(false);
  const [countingError, setCountingError] = useState('');
  const [
    isCountingFinnishedSuccessfully,
    setIsCountingFinnishedSuccessfully,
  ] = useState(false);

  const handleElectionKeyFileSelected = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setIsReadingElectionKeyFile(true);
      setIsElectionKeyError(false);
      const electionKeyFile = e.target.files[0];

      const reader = new FileReader();
      reader.readAsText(electionKeyFile);

      reader.onload = () => {
        const fileContents = reader.result as string;
        let firstLine = fileContents.split('\n', 1)[0].trim();
        // (For line above.) Must use trim to trim away carriage return ('\r').
        // Could have split on '\r\n' but should handle change of line endings.
        if (firstLine.length !== ELECTION_KEY_FROM_FILE_LENGTH) {
          setIsElectionKeyError(true);
        } else {
          setElectionKey(firstLine);
          setElectionKeyFileName(electionKeyFile.name);
          setIsElectionKeyReady(true);
        }
        setIsReadingElectionKeyFile(false);
      };
    }
  };

  const handleStartCounting = async (apolloClient: ApolloClient<any>) => {
    setIsCounting(true);
    let response: IMutationResponse | undefined;
    try {
      const result = await apolloClient.mutate<IStartElectionGroupCount>({
        mutation: startElectionGroupCount,
        variables: {
          id: electionGroup.id,
          electionKey,
        },
        refetchQueries: () => ['electionGroup', 'electionGroupCounts'],
      });
      setIsCounting(false);
      response = result && result.data && result.data.startElectionGroupCount;
    } catch (error) {
      setIsCounting(false);
      console.error(error.message);
      setCountingError(
        t('admin.countingSection.countingModal.errors.backend.unknown')
      );
      return;
    }
    if (!response || !response.success) {
      let errorMessage = t(
        'admin.countingSection.countingModal.errors.backend.unknown'
      );
      if (response && response.code) {
        errorMessage = translateBackendError({
          errorCode: response.code,
          t,
          codePrefix: 'admin.countingSection.countingModal.errors.backend',
        });
      }
      setCountingError(errorMessage);
    } else {
      setIsCountingFinnishedSuccessfully(true);
    }
  };

  const isChooseElectionKeyButtonDisabled =
    isReadingElectionKeyFile || isElectionKeyReady;
  const step1ChooseElectionKeyFileButton = (
    <>
      <div className={classes.inputLabelAndFileName}>
        <input
          type="file"
          name="electionKeyFileInput"
          id="electionKeyFileInput"
          accept="text/plain"
          className={`${classes.hiddenFileInput} file-input`}
          disabled={isChooseElectionKeyButtonDisabled}
          onChange={handleElectionKeyFileSelected}
        />
        <label
          htmlFor="electionKeyFileInput"
          className={classNames({
            [classes.fileInputLabelStyledAsButton]: true,
            [classes.fileInputLabelStyledAsButtonDisabled]: isChooseElectionKeyButtonDisabled,
          })}
        >
          {isElectionKeyReady ? (
            <>
              {t('admin.countingSection.countingModal.electionKeyReady')}
              <AnimatedCheckmark />
            </>
          ) : (
            <>
              {t('admin.countingSection.countingModal.chooseElectionKeyFile')}
              {isReadingElectionKeyFile && (
                <Spinner size="2rem" marginLeft="1.1rem" thin />
              )}
            </>
          )}
        </label>
        {electionKeyFileName && (
          <div className={classes.electionKeyFileName}>
            {t('admin.countingSection.countingModal.chosenFile')}:{' '}
            {electionKeyFileName}
          </div>
        )}
      </div>

      {isElectionKeyError && (
        <p className={classes.errorMessage}>
          {t(
            'admin.countingSection.countingModal.errors.couldNotReadElectionKeyFile'
          )}
        </p>
      )}
    </>
  );

  const step2StartCountingButton = (
    <ApolloConsumer>
      {apolloClient => (
        <>
          <Button
            action={() => handleStartCounting(apolloClient)}
            disabled={
              !isElectionKeyReady ||
              isCounting ||
              isCountingFinnishedSuccessfully
            }
            text={
              <>
                {isCountingFinnishedSuccessfully ? (
                  <>
                    {t('admin.countingSection.countingModal.countingFinnished')}
                    <AnimatedCheckmark />
                  </>
                ) : (
                  <>
                    <span>
                      {t('admin.countingSection.countingModal.startCounting')}
                    </span>
                    {isCounting && (
                      <Spinner size="2rem" marginLeft="1.1rem" thin />
                    )}
                  </>
                )}
              </>
            }
          />
          {countingError && (
            <p className={classes.errorMessage}>{countingError}</p>
          )}
        </>
      )}
    </ApolloConsumer>
  );

  const step3CloseAndSeeResultsButton = (
    <Button
      action={onCloseModalAndSeeResults}
      disabled={!isCountingFinnishedSuccessfully}
      text={t('admin.countingSection.countingModal.closeAndDisplayResults')}
    />
  );

  return (
    <Modal
      header={t('admin.countingSection.countingModal.header')}
      buttons={[
        <Button
          key="cancel-button"
          text={t('general.cancel')}
          action={onCancelModal}
          disabled={isCounting}
          secondary
        />,
      ]}
      minWidth="80rem"
    >
      <>
        <InfoList maxWidth="100rem">
          <InfoListItem bulleted>
            {t('admin.countingSection.countingModal.modalBullet1')}
          </InfoListItem>
          <InfoListItem bulleted>
            {t('admin.countingSection.countingModal.modalBullet2FirstPart')}{' '}
            <ElectionKeyCreatedByInfo electionGroupId={electionGroup.id} />.
          </InfoListItem>
          <InfoListItem bulleted>
            {t('admin.countingSection.countingModal.modalBullet3')}
          </InfoListItem>
        </InfoList>

        <ModalSteps
          width="70rem"
          stepsContent={[
            step1ChooseElectionKeyFileButton,
            step2StartCountingButton,
            step3CloseAndSeeResultsButton,
          ]}
          stepsActiveStatus={[
            true,
            isElectionKeyReady,
            isCountingFinnishedSuccessfully,
          ]}
        />
      </>
    </Modal>
  );
};

export default injectSheet(styles)(CountingModal);
