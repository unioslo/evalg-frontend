import React, { useState, useRef, useEffect } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import { TableRow, TableCell } from 'components/table';
import {
  TableRowForm,
  TableRowFormFields,
  FormField,
  TextInputRF,
} from 'components/form';
import Button, { ButtonContainer } from 'components/button';
import { IPollBook, PersonIdType } from 'interfaces';
import { getPersonIdTypeDisplayName } from 'utils/i18n';
import { validateFeideId } from 'utils/validators';
import Spinner from 'components/animations/Spinner';

const addVoterByIdentifier = gql`
  mutation addVoterByIdentifier(
    $pollbookId: UUID!
    $idType: PersonIdType!
    $idValue: String!
  ) {
    addVoterByIdentifier(
      pollbookId: $pollbookId
      idType: $idType
      idValue: $idValue
      approved: true
      reason: ""
    ) {
      id
    }
  }
`;

const refetchQueries = () => ['electionGroupVoters'];

const useStyles = createUseStyles((theme: any) => ({
  feedback: {
    marginTop: '1.5rem',
  },
  feedbackError: {
    color: theme.formErrorTextColor,
  },
}));

interface AddVoterFormProps {
  pollbook: IPollBook;
  onClose: () => void;
}

const AddVoterForm: React.FunctionComponent<AddVoterFormProps> = (props) => {
  const { pollbook, onClose } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });
  const [feedback, setFeedback] = useState({ text: '', isBackendError: false });
  const inputEl = useRef<HTMLInputElement>(null);

  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    inputEl.current && inputEl.current.focus();
    setFeedback({ text: '', isBackendError: false });
  }, [pollbook.id]);

  return (
    <>
      <TableRow verticalPadding>
        <TableCell colspan={4}>
          <Mutation
            mutation={addVoterByIdentifier}
            refetchQueries={refetchQueries}
          >
            {(add: any) => {
              const addPersonAndSetFeedback = async (values: any) => {
                const { idValue } = values;
                if (!idValue) return;

                let idType: PersonIdType;
                if (validateFeideId(idValue)) {
                  idType = 'feide_id';
                } else {
                  return;
                }

                const idTypeDisplayName = getPersonIdTypeDisplayName(idType, t);

                try {
                  await add({
                    variables: {
                      idType,
                      idValue,
                      pollbookId: props.pollbook.id,
                    },
                  });
                  const feedback = t('census.addedIdTypeWithIdValue', {
                    idType: idTypeDisplayName,
                    idValue,
                  });
                  setFeedback({ text: feedback, isBackendError: false });
                } catch (error) {
                  setFeedback({
                    text:
                      error.toString() +
                      ` (idType: ${idTypeDisplayName}, idValue: ${idValue})`,
                    isBackendError: true,
                  });
                }
              };
              return (
                <Form
                  onSubmit={addPersonAndSetFeedback}
                  validate={validate(lang, t)}
                  render={(formProps) => {
                    const {
                      handleSubmit,
                      errors,
                      valid,
                      pristine,
                      touched,
                      submitting,
                      form,
                    } = formProps;

                    const showValidationErrorFeedback =
                      !pristine &&
                      errors &&
                      errors._errors &&
                      touched &&
                      touched['idValue'];

                    const handleSubmitAndReset = async (e: any) => {
                      e.preventDefault();
                      await handleSubmit();
                      if (valid) {
                        form.reset();
                      }
                    };

                    return (
                      <form onSubmit={handleSubmitAndReset}>
                        <TableRowForm
                          header={
                            t('census.addPersonInCensusFor') +
                            ' ' +
                            props.pollbook.name[lang].toLowerCase()
                          }
                        >
                          <TableRowFormFields>
                            <FormField inline>
                              <Field
                                name="idValue"
                                component={TextInputRF}
                                large
                                placeholder={t('census.feideIdOrBirthNumber')}
                                inputRef={inputEl}
                              />
                            </FormField>
                            <Button
                              height="4.5rem"
                              action={handleSubmitAndReset}
                              disabled={pristine}
                              text={
                                submitting ? (
                                  <>
                                    <span>{t('general.add')}</span>{' '}
                                    <Spinner
                                      size="2rem"
                                      marginLeft="0.8rem"
                                      thin
                                    />
                                  </>
                                ) : (
                                  t('general.add')
                                )
                              }
                            />
                          </TableRowFormFields>
                          <div
                            className={classNames({
                              [classes.feedback]: true,
                              [classes.feedbackError]:
                                feedback.isBackendError ||
                                showValidationErrorFeedback,
                            })}
                          >
                            {showValidationErrorFeedback
                              ? errors
                                ? errors._errors.idValue
                                : ''
                              : feedback.text}
                          </div>
                          <ButtonContainer noTopMargin>
                            <Button
                              action={onClose}
                              text={t('general.close')}
                              secondary
                            />
                          </ButtonContainer>
                        </TableRowForm>
                      </form>
                    );
                  }}
                />
              );
            }}
          </Mutation>
        </TableCell>
      </TableRow>
    </>
  );
};

const validate = (lang: string, t: TFunction) => (values: object) => {
  if (!values.hasOwnProperty('idValue')) {
    return {};
  }

  const { idValue } = values as { idValue: string };
  const errors: object = {};

  if (!idValue) {
    return {};
  } else if (!validateFeideId(idValue)) {
    if (idValue.match(/^\d+/)) {
      errors['idValue'] = t('formErrors.feideIdCannotStartWithNumber');
    } else {
      errors['idValue'] = t('formErrors.invalidFeideId');
    }
  }

  if (errors) {
    // Don't display error messages within the fields themselves
    return { _errors: errors };
  }
  return {};
};

export default AddVoterForm;
