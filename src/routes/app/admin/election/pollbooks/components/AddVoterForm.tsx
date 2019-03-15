import React, { useState, useRef, useEffect } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { TranslationFunction } from 'react-i18next';
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
  t: TranslationFunction;
  lang: string;
  classes: Classes;
}

const AddVoterForm: React.FunctionComponent<AddVoterFormProps> = props => {
  const classes = props.classes;

  const [feedback, setFeedback] = useState({ text: '', isError: false });
  const scrollDiv = useRef<HTMLDivElement>(null);
  const inputEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // scrollDiv.current && scrollDiv.current.scrollIntoView(); // focusing on input (next line) seems to do the job at least in chrome
    inputEl.current && inputEl.current.focus();
    setFeedback({ text: '', isError: false });
  }, [props.pollbook.id]);

  return (
    <>
      <div ref={scrollDiv} />
      <TableRow verticalPadding={true}>
        <TableCell colspan={4}>
          <Mutation mutation={addVoterById} refetchQueries={refetchQueries}>
            {add => {
              const addAndClose = async (values: any) => {
                const idValue = values.idValue;
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
                  setFeedback({ text: feedback, isError: false });
                } catch (error) {
                  setFeedback({
                    text:
                      error.toString() +
                      ` (idType: ${idTypeDisplayName}, idValue: ${idValue})`,
                    isError: true,
                  });
                }
              };
              return (
                <Form
                  onSubmit={addAndClose}
                  validate={validate(props.lang, props.t)}
                  initialValues={{ idValue: '' }}
                  render={formProps => {
                    const {
                      handleSubmit,
                      errors,
                      valid,
                      touched,
                      submitting,
                      form,
                    } = formProps;

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
                              disabled={!valid}
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
                                feedback.isError ||
                                (errors && touched && touched['idValue']),
                            })}
                          >
                            {errors && touched && touched['idValue']
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

const validate = (lang: string, t: TranslationFunction) => (values: object) => {
  const { idValue } = values as { idValue: string };

  const errors: object = {};

  if (!idValue) {
    errors['idValue'] = t('general.required');
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
