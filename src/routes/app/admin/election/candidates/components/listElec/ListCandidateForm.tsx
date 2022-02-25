import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';

import {
  TableRowForm,
  TableRowFormFields,
  FormButtons,
  FormField,
  FormFieldGroup,
} from 'components/form';
import { MsgBox } from 'components/msgbox';
import { DeleteCandidateVars } from './mutations';
import { CheckBox, NumberInput, TextInput } from 'components/newForm';

interface ListCandidateFormProps {
  handleSubmit: (e: any) => void;
  cancelAction: (e: any) => void;
  isLocked: boolean;
  deleteAction?: (values: DeleteCandidateVars) => void;
  initialValues: object;
  formHeader: any | string;
  edit?: boolean;
}

export default function ListCandidateForm(props: ListCandidateFormProps) {
  const { cancelAction, initialValues, isLocked, deleteAction } = props;

  const { t } = useTranslation();

  const validate = (values: any) => {
    const errors: any = {
      name: undefined,
    };
    if (!values.name) {
      errors.name = t('admin.listElec.errors.candidateNameMissing');
    }

    return errors;
  };

  console.info(isLocked);

  return (
    <Form
      onSubmit={props.handleSubmit}
      initialValues={initialValues}
      validate={validate}
      render={(formProps) => {
        const { handleSubmit, pristine, valid } = formProps;

        return (
          <>
            {isLocked && (
              <MsgBox
                msg={t('admin.listElec.lockedElectionCandidateMsg')}
                timeout={false}
              />
            )}

            <form onSubmit={handleSubmit}>
              <TableRowForm header={props.formHeader}>
                <TableRowFormFields>
                  <FormFieldGroup flexGrow>
                    <FormField>
                      <Field
                        name="priority"
                        component={NumberInput}
                        label={t('admin.listElec.candidateTable.placement')}
                        defaultValue={0}
                        disabled={isLocked}
                      />
                    </FormField>
                    <FormField>
                      <Field
                        name="name"
                        component={TextInput}
                        label={t('general.name')}
                        placeholder={t('election.candidateNamePlaceHolder')}
                      />
                    </FormField>
                    <FormField>
                      <Field
                        name="fieldOfStudy"
                        component={TextInput}
                        label={t('admin.listElec.candidateTable.fieldOfStudy')}
                        placeholder={t(
                          'admin.listElec.candidateTable.fieldOfStudy'
                        )}
                      />
                    </FormField>
                    <FormField>
                      <Field
                        name="preCumulated"
                        type="checkbox"
                        component={CheckBox}
                        label={t(
                          'admin.listElec.candidateTable.preAccumulated'
                        )}
                        disabled={isLocked}
                      />
                    </FormField>
                  </FormFieldGroup>
                </TableRowFormFields>
                <FormButtons
                  saveAction={handleSubmit}
                  closeAction={cancelAction}
                  submitDisabled={pristine || !valid}
                  entityAction={deleteAction}
                  entityActionDisabled={isLocked}
                  entityDanger
                  entityText={t('election.deleteCandidate')}
                />
              </TableRowForm>
            </form>
          </>
        );
      }}
    />
  );
}

ListCandidateForm.defaultProps = {
  edit: false,
};
