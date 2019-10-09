import React from 'react';
import { Form, Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { useTranslation } from 'react-i18next';

import Button from 'components/button'
import {
  TableRowForm,
  TableRowFormFields,
  FormButtons,
  FormField,
  FormFieldGroup,
  TextInputRF,
} from 'components/form';

import Icon from 'components/icon';

interface IProps {
  handleSubmit: (a: any) => void;
  cancelAction: (id: any) => void;
  deleteAction?: () => void;
  initialValues: object;
  formHeader: any | string;
}

const PrefTeamElecCandForm: React.FunctionComponent<IProps> = (
  props: IProps
) => {
  const {
    cancelAction,
    initialValues,
    // deleteAction
  } = props;

  const { t } = useTranslation();

  return (
    <Form
      onSubmit={props.handleSubmit}
      mutators={{ ...arrayMutators }}
      initialValues={initialValues}
      render={formProps => {
        const {
          handleSubmit,
          form: {
            mutators: { push }
          },
          pristine,
          valid,
        } = formProps;
        return (
          <form onSubmit={handleSubmit}>
            <TableRowForm header={props.formHeader}>
              <TableRowFormFields>
                <FormFieldGroup flexGrow>
                  <FormField>
                    <Field
                      name="name"
                      component={TextInputRF}
                      label={t('general.name')}
                      placeholder={t('election.candidateNamePlaceHolder')}
                    />
                  </FormField>
                  <FormField>
                    <Field
                      name="informationUrl"
                      component={TextInputRF}
                      label={t('general.webpage')}
                      placeholder={t('general.webpage')}
                    />
                  </FormField>

                  <FieldArray name='coCandidates'>
                    {({ fields }) =>
                      fields.map((coCandidate, index) => (
                        <FormField
                          action={
                            <Icon
                              type='remove'
                              onClick={() => fields.remove(index)}
                              custom={{ color: 'teal', small: true }}
                              title={t('election.removeCoCandidateNr', { number: index + 1 })}
                            />
                          } key={index}>
                          <Field
                            name={`${coCandidate}.name`}
                            component={TextInputRF}
                            label={t('election.coCandidateNr', { number: index + 1 })}
                            placeholder={t(
                              'election.coCandidateNamePlaceHolder'
                            )}
                          />
                        </FormField>
                      ))
                    }
                  </FieldArray>
                  <div style={{ marginTop: '2rem' }}>
                    <Button
                      text={t('election.newCoCandidate')}
                      action={() => push('coCandidates', {})}
                      secondary
                    />
                  </div>
                </FormFieldGroup>
              </TableRowFormFields>
              <FormButtons
                saveAction={handleSubmit}
                closeAction={cancelAction}
                submitDisabled={pristine || !valid}
                entityAction={props.deleteAction}
                entityText={t('election.deleteCandidate')}
              />
            </TableRowForm>
          </form >
        );
      }}
    />
  );
};

export default PrefTeamElecCandForm;
