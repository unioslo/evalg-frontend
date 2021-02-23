import React from 'react';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';

import {
  TableRowForm,
  TableRowFormFields,
  FormButtons,
  FormField,
  FormFieldGroup,
  TextInputRF,
} from 'components/form';

interface IProps {
  onSubmit: (a: any) => void;
  cancelAction: (id: any) => void;
  deleteAction?: (id: any) => void;
  isLocked: boolean;
  initialValues: object;
  formHeader: any | string;
}

const PollElecAlternativeForm: React.FunctionComponent<IProps> = (
  props: IProps
) => {
  const { cancelAction, onSubmit, initialValues, isLocked } = props;

  const { t } = useTranslation();

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={formProps => {
        const { handleSubmit, pristine, valid } = formProps;
        return (
          <form onSubmit={handleSubmit}>
            <TableRowForm header={props.formHeader}>
              <TableRowFormFields>
                <FormFieldGroup flexGrow>
                  <FormField>
                    <Field
                      name="name"
                      component={TextInputRF}
                      label={t('admin.pollElec.alternative')}
                      placeholder={t('admin.pollElec.alternative')}
                      large
                    />
                  </FormField>
                </FormFieldGroup>
              </TableRowFormFields>
              <FormButtons
                saveAction={handleSubmit}
                closeAction={cancelAction}
                submitDisabled={pristine || !valid}
                entityAction={props.deleteAction}
                entityActionDisabled={isLocked}
                entityText={t('admin.pollElec.deleteAlternative')}
              />
            </TableRowForm>
          </form>
        );
      }}
    />
  );
};

export default PollElecAlternativeForm;
