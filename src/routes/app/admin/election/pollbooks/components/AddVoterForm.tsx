import React, { useState, useRef, useEffect } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import injectSheet from 'react-jss';
import { Classes } from 'jss';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';

import { TableRow, TableCell } from '../../../../../../components/table';
import {
  TableRowForm,
  TableRowFormFields,
  FormField,
  TextInputRF,
} from '../../../../../../components/form';
import Button, { ButtonContainer } from '../../../../../../components/button';
import { IPollBook } from '../../../../../../interfaces';
import { getVoterIdTypeDisplayName } from '../../../../../../utils/i18n';
import Spinner from '../../../../../../components/animations/Spinner';
import i18n from 'i18next';

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
  // TODO, get the t function from useTranslations
  t: i18n.TFunction;
  lang: string;
  classes: Classes;
}

const AddVoterForm: React.FunctionComponent<AddVoterFormProps> = props => {
  const classes = props.classes;

  const [feedback, setFeedback] = useState({ text: '', isBackendError: false });
  const inputEl = useRef<HTMLInputElement>(null);

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
                const idType = idValue.match(/^\d{11}$/) ? 'nin' : 'uid';
                const idTypeDisplayName = getVoterIdTypeDisplayName(
                  idType,
                  props.t
                ).toLowerCase();
                try {
                  await add({
                    variables: {
                      idType,
                      idValue,
                      pollbookId: props.pollbook.id,
                    },
                  });
                  const feedback = props.t('census.addedIdTypeWithIdValue', {
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
                  validate={validate(props.lang, props.t)}
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

                    return (
                      <form
                        onSubmit={async (event: any) => {
                          await handleSubmit(event);
                          if (valid) {
                            form.reset();
                          }
                        }}
                      >
                        <TableRowForm
                          header={
                            props.t('census.addPersonInCensusFor') +
                            ' ' +
                            props.pollbook.name[props.lang].toLowerCase()
                          }
                        >
                          <TableRowFormFields>
                            <FormField inline>
                              <Field
                                name="idValue"
                                component={TextInputRF}
                                large={true}
                                placeholder={props.t(
                                  'census.usernameOrBirthNumber'
                                )}
                                inputRef={inputEl}
                              />
                            </FormField>
                            <Button
                              height="4.5rem"
                              action={handleSubmit}
                              disabled={pristine || !valid}
                              text={
                                submitting ? (
                                  <>
                                    <span>{props.t('general.add')}</span>{' '}
                                    <Spinner
                                      size="2rem"
                                      marginLeft="0.8rem"
                                      thin
                                    />
                                  </>
                                ) : (
                                  props.t('general.add')
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
                              text={props.t('general.close')}
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
  } else if (!idValue.match(/^\d{11}$/) && !idValue.match(/^[a-zæøå]+/)) {
    if (idValue.match(/^\d+$/) && !idValue.match(/^\d{11}$/)) {
      errors['idValue'] = t(
        'formErrors.censusAddVoter.birthNumberIncorrectNumberOfDigits'
      );
    } else if (idValue.match(/^\d+/)) {
      errors['idValue'] = t(
        'formErrors.censusAddVoter.usernameCannotStartWithNumber'
      );
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
