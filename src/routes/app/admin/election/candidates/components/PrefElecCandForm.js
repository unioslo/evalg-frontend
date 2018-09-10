/* @flow */
import * as React from 'react';
import { Form, Field } from 'react-final-form';
import { Trans, translate } from 'react-i18next';

import {
  TableRowForm, TableRowFormFields,
  FormButtons, FormField, FormErrorMsg,
  TextInputRF, DropDownRF
} from 'components/form';

type Props = {
  handleSubmit: Function,
  cancelAction: Function,
  deleteAction: Function,
  formHeader: ReactElement | string,
  listDict: Object,
  i18n: Object,
  t: Function,
  candidate: Object,
}


const validate = (lang: string, t: Function) => (values: Object) => {
  const errors = {};
  if (!values.name) {
    errors.name =
      <span>
        {t('election.candidateNamePlaceHolder')}:
        <Trans>general.required</Trans>
      </span>;
  }
  if (!values.gender) {
    errors.gender =
      <span>
        {t('general.gender')}:
        <Trans>general.required</Trans>
      </span>;
  }
  if (!values.listId) {
    errors.listId =
      <span>
        {t('general.group')}:
        <Trans>general.required</Trans>
      </span>;
  }
  // We don't want to display error messages within the field themselves
  if (Object.keys(errors).length) {
    return { _errors: errors };
  }
  return {};
};


class PrefElecCandForm extends React.Component<Props> {
  render() {
    const {
      t, cancelAction, listDict, candidate
    } = this.props;
    const lang = this.props.i18n.language;
    const genderOptions = [
      { name: t('general.male'), value: 'male' },
      { name: t('general.female'), value: 'female' },
    ];
    const candListOptions = Object.keys(listDict).map(id => {
      return {
        name: listDict[id].name[lang], value: id
      }
    });
    return (
      <Form
        onSubmit={this.props.handleSubmit}
        validate={validate(lang, t)}
        initialValues={this.props.candidate}
        render={(formProps: Object) => {
          const {
            handleSubmit, reset, submitting, pristine, values, invalid, errors,
            valid, touched
          } = formProps;
          return (
            <form onSubmit={handleSubmit}>
              <TableRowForm header={this.props.formHeader}>
                <TableRowFormFields>
                  <FormField inline>
                    <Field
                      name="name"
                      component={TextInputRF}
                      large
                      placeholder={t('election.candidateNamePlaceHolder')}
                    />
                  </FormField>
                  <FormField inline>
                    <Field
                      name="gender"
                      component={DropDownRF}
                      options={genderOptions}
                      placeholder={t('general.gender')}
                    />
                  </FormField>
                  <FormField inline>
                    <Field
                      name="listId"
                      component={DropDownRF}
                      options={candListOptions}
                      large
                      placeholder={t('general.group')}
                    />
                  </FormField>
                </TableRowFormFields>
                {!pristine && errors._errors && Object.keys(errors._errors).map((field, index) => {
                  if (touched[field]) {
                    return <FormErrorMsg key={index} msg={errors._errors[field]} />;
                  }
                })}
                <FormButtons
                  saveAction={handleSubmit}
                  closeAction={cancelAction}
                  submitDisabled={pristine || !valid}
                  entityAction={this.props.deleteAction}
                  entityText={<Trans>election.deleteCandidate</Trans>}
                />
              </TableRowForm>
            </form>
          )
        }}
      />
    )
  }
}

export default translate()(PrefElecCandForm);