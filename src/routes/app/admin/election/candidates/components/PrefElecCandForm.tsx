import * as React from 'react';
import { Form, Field } from 'react-final-form';
import { Trans, translate } from 'react-i18next';

import {
  TableRowForm, TableRowFormFields,
  FormButtons, FormField, FormErrorMsg,
  TextInputRF, DropDownRF
} from '../../../../../../components/form';
import { i18n } from 'i18next';

interface IProps {
  handleSubmit: (e: any) => void,
  cancelAction: (id: any) => void,
  deleteAction?: () => void,
  formHeader: any | string,
  listDict: any,
  i18n: i18n,
  t: (s: string) => string,
  candidate: any,
  options?: any[];
}


// const validate = (lang: string, t: Function) => (values: Object) => {
const validate = (lang: string, t: (s: string) => string) => (values: any) => {
  const errors: any = {};
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


class PrefElecCandForm extends React.Component<IProps> {


  render() {
    const {
      t,
      cancelAction,
      listDict,
      // candidate
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
        render={(formProps) => {
          const {
            handleSubmit,
            // reset,
            // submitting,
            pristine,
            // values,
            // invalid,
            errors,
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
                      large={true}
                      placeholder={t('election.candidateNamePlaceHolder')}
                    />
                  </FormField>
                  <FormField inline>
                    <Field
                      name="gender"
                      component={DropDownRF as any}
                      options={genderOptions}
                      placeholder={t('general.gender')}
                    />
                  </FormField>
                  <FormField inline>
                    <Field
                      name="listId"
                      component={DropDownRF as any}
                      options={candListOptions}
                      large
                      placeholder={t('general.group')}
                    />
                  </FormField>
                </TableRowFormFields>
                {!pristine && errors._errors && Object.keys(errors._errors).map((field, index) => {
                  if (touched && touched[field]) {
                    return <FormErrorMsg key={index} msg={errors._errors[field]} />;
                  } else {
                    return <React.Fragment key={index}/>;
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