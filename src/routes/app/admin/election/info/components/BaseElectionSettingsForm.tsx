import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { withTranslation, WithTranslation } from 'react-i18next';

import { disableGenderQuotaButton } from 'appConfig';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from 'components/table';
import { CheckBox } from 'components/form';
import { NumberInputRF, FormButtons } from 'components/form';
import { PageSubSection } from 'components/page';
import { ElectionBaseSettingsInput, ElectionGroup, Election } from 'interfaces';

export interface IElectionsBaseSettings {
  elections: ElectionBaseSettingsInput[];
}

// TODO: Finish implementing
const validate = () => {
  const errors = {};
  return errors;
};

const buildInitialValues = (electionGroup: ElectionGroup) => ({
  elections: electionGroup.elections.map((e) => ({
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

interface IProps extends WithTranslation {
  electionGroup: ElectionGroup;
  onSubmit: (electionBaseSettings: IElectionsBaseSettings) => any;
  closeAction: () => void;
}

class BaseElectionSettingsForm extends React.Component<IProps> {
  isSubmitting = false;

  initialValues = buildInitialValues(this.props.electionGroup);

  constructor(props: IProps) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  shouldComponentUpdate() {
    return !this.isSubmitting;
  }

  // TODO fix type here, was {elections: ElectionBaseSettingsInput[]}
  async handleFormSubmit(submitValues: any) {
    this.isSubmitting = true;
    await this.props.onSubmit(buildSubmitPayload(submitValues));
    this.isSubmitting = false;
  }

  render() {
    const { i18n, t } = this.props;
    const lang = i18n.language;
    const { elections } = this.initialValues;
    return (
      <Form
        onSubmit={this.handleFormSubmit}
        mutators={{ ...arrayMutators }}
        initialValues={this.initialValues}
        validate={validate}
      >
        {(formProps: FormRenderProps) => {
          const { handleSubmit, values, valid, submitting } = formProps;
          return (
            // TODO: There should probably be a generalized "table builder" component that takes table headings
            // and table cell content as props.
            <form onSubmit={handleSubmit}>
              <Table>
                <TableHeader>
                  <TableHeaderRow>
                    <TableHeaderCell>{t('election.group')}</TableHeaderCell>
                    <TableHeaderCell>
                      {t('election.nrOfCandidates')}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t('election.nrOfCoCandidates')}
                    </TableHeaderCell>
                  </TableHeaderRow>
                </TableHeader>
                <FieldArray<Election> name="elections">
                  {({ fields }) => (
                    <TableBody>
                      {fields.map((election, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <Field
                                name={`${election}.active`}
                                type="checkbox"
                                label={elections[index].name[lang]}
                              >
                                {({ input, label }) => (
                                  <CheckBox {...input} label={label} />
                                )}
                              </Field>
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
              <PageSubSection header={t('election.quotas')}>
                <Field
                  name="hasGenderQuota"
                  type="checkbox"
                  label={t('election.hasGenderQuota')}
                  disabled={disableGenderQuotaButton}
                >
                  {({ input, label }) => (
                    <CheckBox
                      {...input}
                      disabled={disableGenderQuotaButton}
                      label={label}
                    />
                  )}
                </Field>
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

export default withTranslation()(BaseElectionSettingsForm);
