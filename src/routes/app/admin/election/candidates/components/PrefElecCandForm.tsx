import React from 'react';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';

import {
  TableRowForm,
  TableRowFormFields,
  FormButtons,
  FormField,
  FormErrorMsg,
  TextInputRF,
  DropDownRF,
} from 'components/form';

interface IProps {
  handleSubmit: (e: any) => void;
  cancelAction: (id: any) => void;
  deleteAction?: () => void;
  formHeader: any | string;
  listDict: any;
  candidate: any;
  options?: any[];
}

const validate = (lang: string, t: (s: string) => string) => (values: any) => {
  const errors: any = {};
  if (!values.name) {
    errors.name = (
      <span>
        {t('election.candidateNamePlaceHolder')}:{t('general.required')}
      </span>
    );
  }
  if (!values.gender) {
    errors.gender = (
      <span>
        {t('general.gender')}:{t('general.required')}
      </span>
    );
  }
  if (!values.listId) {
    errors.listId = (
      <span>
        {t('general.group')}:{t('general.required')}
      </span>
    );
  }
  // We don't want to display error messages within the field themselves
  if (Object.keys(errors).length) {
    return { _errors: errors };
  }
  return {};
};

const PrefElecCandForm: React.FunctionComponent<IProps> = (props: IProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { cancelAction, listDict } = props;

  const genderOptions = [
    { name: t('general.male'), value: 'male' },
    { name: t('general.female'), value: 'female' },
  ];
  const candListOptions = Object.keys(listDict).map(id => {
    return {
      name: listDict[id].name[lang],
      value: id,
    };
  });
  return (
    <Form
      onSubmit={props.handleSubmit}
      validate={validate(lang, t)}
      initialValues={props.candidate}
      render={formProps => {
        const { handleSubmit, pristine, errors, valid, touched } = formProps;
        return (
          <form onSubmit={handleSubmit}>
            <TableRowForm header={props.formHeader}>
              <TableRowFormFields>
                <FormField inline>
                  <Field
                    name="name"
                    component={TextInputRF}
                    large
                    label={t('general.name')}
                    placeholder={t('election.candidateNamePlaceHolder')}
                  />
                </FormField>
                <FormField inline>
                  <Field
                    name="gender"
                    component={DropDownRF as any}
                    options={genderOptions}
                    label={t('general.gender')}
                    placeholder={t('general.gender')}
                  />
                </FormField>
                <FormField inline>
                  <Field
                    name="listId"
                    component={DropDownRF as any}
                    options={candListOptions}
                    large
                    label={t('general.group')}
                    placeholder={t('general.group')}
                  />
                </FormField>
              </TableRowFormFields>
              {!pristine &&
                errors._errors &&
                Object.keys(errors._errors).map((field, index) => {
                  if (touched && touched[field]) {
                    return (
                      <FormErrorMsg key={index} msg={errors._errors[field]} />
                    );
                  }
                  return <React.Fragment key={index} />;
                })}
              <FormButtons
                saveAction={handleSubmit}
                closeAction={cancelAction}
                submitDisabled={pristine || !valid}
                entityAction={props.deleteAction}
                entityText={t('election.deleteCandidate')}
              />
            </TableRowForm>
          </form>
        );
      }}
    />
  );
};

export default PrefElecCandForm;
