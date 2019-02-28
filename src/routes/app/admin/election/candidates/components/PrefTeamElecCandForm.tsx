import * as React from 'react';
import { Form, Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
// import arrayMutators from 'final-form-arrays'
import { Trans, translate } from 'react-i18next';

import ActionText from '../../../../../../components/actiontext';
import {
  TableRowForm, TableRowFormFields,
  FormButtons, FormField, FormFieldGroup, TextInputRF
} from '../../../../../../components/form';

import { validateUrl } from '../../../../../../utils/validators';

interface IProps {
  handleSubmit: (a: any) => void,
  cancelAction: (id: any) => void,
  deleteAction?: () => void,
  initialValues: object,
  formHeader: any | string,
  t: (s: string) => string,
}


// const validate = (values: Object, props: Props) => {
const validate = (values: any, props: IProps) => {
  const errors: any = {};
  const coCandidatesErrors = [];
  const { name, informationUrl, coCandidates } = values;
  if (!name) {
    errors.name = <Trans>general.required</Trans>
  }
  if (informationUrl && !validateUrl(informationUrl)) {
    errors.informationUrl = <Trans>formErrors.invalidUrl</Trans>
  }
  const coCandErrors = coCandidates.map((coCandidate: any, index: any) => {
    if (!coCandidate.name) {
      return { name: <Trans>general.required</Trans> }
    }
    return null;
  });
  if (coCandidatesErrors.length) {
    errors.coCandidates = coCandErrors;
  }
  return errors;
};


const PrefTeamElecCandForm = (props: IProps) =>  {
  const { t, cancelAction, initialValues, deleteAction} = props;
  return (
    <Form
      onSubmit={props.handleSubmit}
      // mutators={arrayMutators}
      initialValues={initialValues}
      render={(formProps) => {
        const {
          handleSubmit, reset, submitting, pristine, values, invalid, errors,
          valid
        } = formProps;
        return (
          <form onSubmit={ handleSubmit }>
            <TableRowForm header={ props.formHeader }>
              <TableRowFormFields>
                <FormFieldGroup flexGrow>
                  <FormField>
                    <Field
                      name="name"
                      component={ TextInputRF }
                      placeholder={t('election.candidateNamePlaceHolder')}
                    />
                  </FormField>
                  <FormField>
                    <Field
                      name="informationUrl"
                      component={ TextInputRF }
                      placeholder={t('general.webpage')}
                    />
                  </FormField>
                </FormFieldGroup>
                <FormFieldGroup flexGrow noTopMargin>
                  <FieldArray
                    name="coCandidates">
                    {({fields}) => (
                      <div>
                        {fields.map((coCandidate, index) => {
                          if (index === 0) {
                            return (
                              <FormField key={index} action={true}>
                                <Field
                                  name={`${coCandidate}.name`}
                                  component={ TextInputRF }
                                  placeholder={t('election.coCandidateNamePlaceHolder')}
                                />
                              </FormField>
                            )
                          }
                          const removeAction =
                            <ActionText action={ () => fields.remove(index) }>
                              <Trans>general.remove</Trans>
                            </ActionText>;
                          return (
                            <FormField action={ removeAction } key={index}>
                              <Field
                                name={`${coCandidate}.name`}
                                component={ TextInputRF }
                                placeholder={t('election.coCandidateNamePlaceHolder')}
                              />
                            </FormField>
                          )
                        })}
                        <div style={{ marginTop: '2rem'}}>
                          <ActionText action={() => fields.push({})}>
                            <Trans>election.newCoCandidate</Trans>
                          </ActionText>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </FormFieldGroup>
              </TableRowFormFields>
              <FormButtons
                saveAction={ handleSubmit }
                closeAction={ cancelAction }
                submitDisabled={ pristine || !valid }
                entityAction={ props.deleteAction }
                entityText={ <Trans>election.deleteCandidate</Trans> }
              />
            </TableRowForm>
          </form>
        )
      }}
    />
    )
  }

export default translate()(PrefTeamElecCandForm);