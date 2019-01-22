import * as React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { translate, Trans } from 'react-i18next';
import { i18n } from 'i18next';

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

export interface IElectionsBaseSettings {
  elections: ElectionBaseSettingsInput[];
}

// TODO: Finish implementing
const validate = (values: any) => {
  const errors = {};
  return errors;
};

const buildInitialValues = (electionGroup: ElectionGroup) => ({
  elections: electionGroup.elections.map(e => ({
    id: e.id,
    active: e.active,
    name: e.name,
    seats: e.meta.candidateRules.seats,
    substitutes: e.meta.candidateRules.substitutes,
  })),
  hasGenderQuota: electionGroup.meta.candidateRules.candidateGender,
  id: electionGroup.id,
});

const buildSubmitPayload = (
  submitValues: IElectionsBaseSettings
): IElectionsBaseSettings => ({
  ...submitValues, // TODO: is this nececarry / used?
  elections: submitValues.elections.map((e: ElectionBaseSettingsInput) => ({
    id: e.id,
    active: e.active,
    seats: e.seats ? e.seats : 0,
    substitutes: e.substitutes ? e.substitutes : 0,
  })),
});

interface IProps {
  electionGroup: ElectionGroup;
  onSubmit: (electionBaseSettings: IElectionsBaseSettings) => any;
  closeAction: () => void;
  i18n: i18n;
}

class BaseElectionSettingsForm extends React.Component<IProps> {
  isSubmitting = false;
  initialValues = buildInitialValues(this.props.electionGroup);

  constructor(props: IProps) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  async handleFormSubmit(submitValues: {
    elections: ElectionBaseSettingsInput[];
  }) {
    this.isSubmitting = true;
    await this.props.onSubmit(buildSubmitPayload(submitValues));
    this.isSubmitting = false;
  }

  shouldComponentUpdate() {
    return !this.isSubmitting;
  }

  render() {
    const lang = this.props.i18n.language;
    const { elections } = this.initialValues;
    return (
      <Form
        onSubmit={this.handleFormSubmit}
        initialValues={this.initialValues}
        validate={validate}
      >
        {(formProps: FormRenderProps) => {
          const {
            handleSubmit,
            values,
            valid,
            submitting,
          } = formProps;
          return (
            // TODO: There should probably be a generalized "table builder" component that takes table headings
            // and table cell content as props.
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
                <FieldArray name="elections">
                  {({ fields }) => (
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
                              />
                            </TableCell>
                            <TableCell>
                              <Field
                                name={`${election}.seats`}
                                component={NumberInputRF}
                                disabled={
                                  !values.elections[index].active || submitting
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Field
                                name={`${election}.substitutes`}
                                component={NumberInputRF}
                                disabled={
                                  !values.elections[index].active || submitting
                                }
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  )}
                </FieldArray>
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
                submitting={submitting}
                saveAction={handleSubmit}
                closeAction={this.props.closeAction}
                submitDisabled={!valid || submitting}
              />
            </form>
          );
        }}
      </Form>
    );
  }
}

export default translate()(BaseElectionSettingsForm);
