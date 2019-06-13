import React, { useState, useRef, useEffect } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import injectSheet from 'react-jss';
import { Classes } from 'jss';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';
import i18n from 'i18next';

import { TableRow, TableCell } from 'components/table';
import {
  TableRowForm,
  TableRowFormFields,
  FormField,
  TextInputRF,
} from 'components/form';
import Button, { ButtonContainer } from 'components/button';
import { IPollBook } from 'interfaces';
import { getVoterIdTypeDisplayName } from 'utils/i18n';
import Spinner from 'components/animations/Spinner';
import { useTranslation } from 'react-i18next';

const addVoterById = gql`
  mutation addVoterById(
    $pollbookId: UUID!
    $idType: IdType!
    $idValue: String!
  ) {
    addVoterById(
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

const feideIdRE = /^[a-zæøåA-ZÆØÅ_][a-zæøåA-ZÆØÅ0-9_.]*@[a-zæøåA-ZÆØÅ0-9_.]+$/;
const ninRE = /^\d{11}$/;

const styles = (theme: any) => ({
  feedback: {
    marginTop: '1.5rem',
  },
  feedbackError: {
    color: theme.formErrorTextColor,
  },
});

interface AddVoterFormProps {
  pollbook: IPollBook;
  onClose: () => void;
  classes: Classes;
}

const AddVoterForm: React.FunctionComponent<AddVoterFormProps> = props => {
  const classes = props.classes;

  const [feedback, setFeedback] = useState({ text: '', isBackendError: false });
  const inputEl = useRef<HTMLInputElement>(null);

  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    inputEl.current && inputEl.current.focus();
    setFeedback({ text: '', isBackendError: false });
  }, [props.pollbook.id]);

  return (
    <>
      <TableRow verticalPadding={true}>
        <TableCell colspan={4}>
          <Mutation mutation={addVoterById} refetchQueries={refetchQueries}>
            {add => {
              const addPersonAndSetFeedback = async (values: any) => {
                const idValue = values.idValue;
                if (!idValue) return;

                let idType;
                if (idValue.match(feideIdRE)) {
                  idType = 'feide_id';
                } else if (idValue.match(ninRE)) {
                  idType = 'nin';
                } else {
                  return;
                }

                const idTypeDisplayName = getVoterIdTypeDisplayName(idType, t);

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
                  render={formProps => {
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
                                large={true}
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
                              ? errors._errors.idValue
                              : feedback.text}
                          </div>
                          <ButtonContainer noTopMargin>
                            <Button
                              action={props.onClose}
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

const validate = (lang: string, t: i18n.TFunction) => (values: object) => {
  if (!values.hasOwnProperty('idValue')) {
    return {};
  }

  const { idValue } = values as { idValue: string };
  const errors: object = {};

  if (!idValue) {
    return {};
  } else if (!idValue.match(ninRE) && !idValue.match(feideIdRE)) {
    if (idValue.match(/^\d+$/) && !idValue.match(/^\d{11}$/)) {
      errors['idValue'] = t(
        'formErrors.censusAddVoter.birthNumberIncorrectNumberOfDigits'
      );
    } else if (idValue.match(/^\d+/)) {
      errors['idValue'] = t(
        'formErrors.censusAddVoter.feideIdCannotStartWithNumber'
      );
    } else {
      errors['idValue'] = t('formErrors.censusAddVoter.invalidFeideId');
    }
  }

  if (errors) {
    // Don't display error messages within the fields themselves
    return { _errors: errors };
  } else {
    return {};
  }
};

export default injectSheet(styles)(AddVoterForm);
