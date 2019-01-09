/* @flow */
import * as React from 'react';
import { Field, Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { translate, Trans } from 'react-i18next';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from 'components/table';

import { CheckBoxRF } from 'components/form';
import { NumberInputRF, FormButtons } from 'components/form';
import { PageSubSection } from 'components/page';

type ValidateValues = {};

const validate = (values: ValidateValues) => {
  const errors = {};
  return errors;
};

type Props = {
  handleSubmit: Function,
  closeAction: Function,
  initialValues: Object,
  i18n: Object,
};

class BaseElectionSettingsForm extends React.Component<Props> {
  render() {
    const lang = this.props.i18n.language;
    const { initialValues } = this.props;
    const { elections } = initialValues;
    return (
      <Form
        onSubmit={this.props.handleSubmit}
        initialValues={this.props.initialValues}
        validate={validate}
        render={(formProps: Object) => {
          const {
            handleSubmit,
            reset,
            submitting,
            pristine,
            values,
            invalid,
            errors,
            valid,
          } = formProps;
          return (
            <form onSubmit={handleSubmit}>
              <Table>
                <TableHeader>
                  <TableHeaderRow>
                    <TableHeaderCell>
                      <Trans>election.group</Trans>
                    </TableHeaderCell>
                    <TableHeaderCell>
                      <Trans>election.nrOfCandidates</Trans>
                    </TableHeaderCell>
                    <TableHeaderCell>
                      <Trans>election.nrOfCoCandidates</Trans>
                    </TableHeaderCell>
                  </TableHeaderRow>
                </TableHeader>
                <FieldArray
                  name="elections"
                  render={({ fields }) => (
                    <TableBody>
                      {fields.map((election, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <Field
                                name={`${election}.active`}
                                component={CheckBoxRF}
                                type="checkbox"
                                label={elections[index].name[lang]}
                                normalize={val => !!val}
                              />
                            </TableCell>
                            <TableCell>
                              <Field
                                name={`${election}.seats`}
                                component={NumberInputRF}
                                disabled={!values.elections[index].active}
                              />
                            </TableCell>
                            <TableCell>
                              <Field
                                name={`${election}.substitutes`}
                                component={NumberInputRF}
                                disabled={!values.elections[index].active}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  )}
                />
              </Table>
              <PageSubSection header={<Trans>election.quotas</Trans>}>
                <Field
                  name="hasGenderQuota"
                  component={CheckBoxRF}
                  type="checkbox"
                  label={<Trans>election.hasGenderQuota</Trans>}
                />
              </PageSubSection>
              <FormButtons
                saveAction={handleSubmit}
                closeAction={this.props.closeAction}
                submitDisabled={pristine || !valid}
              />
            </form>
          );
        }}
      />
    );
  }
}

export default translate()(BaseElectionSettingsForm);
