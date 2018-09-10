/* @flow */
import * as React from 'react';
import { isObjEmpty } from 'utils/helpers';
import { Field, Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  DateInputRF,
  FormButtons,
  FormErrorMsg,
  FormField,
  FormFieldGroup,
  RadioButtonGroup,
  TextInputRF
} from 'components/form';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableRow
} from 'components/table';

import { validateEmail, validateUrl } from 'utils/validators';
import { equalValues } from 'utils';

import { PageSection, PageSubSection } from 'components/page';
import { Trans, translate } from 'react-i18next';
import Text from 'components/text';

const validate = (lang: string) => (values: Object) => {
  const errors = {};
  const elecErrors: Array<Object> = [];
  values.elections.forEach(e => elecErrors.push({}));
  const formErrors: Object = { mandateDates: [], contact: [], informationUrl: [] };
  const {
    elections, hasMultipleMandateTimes,
    hasMultipleContactInfo, hasMultipleInfoUrls
  } = values;

  if (!hasMultipleMandateTimes) {
    const { mandatePeriodStart, mandatePeriodEnd } = elections[0];
    if (mandatePeriodStart && mandatePeriodEnd &&
      mandatePeriodStart >= mandatePeriodEnd) {
      formErrors.mandateDates.push({
        msg: <Trans>formErrors.invalidDates</Trans>,
        index: 0
      });
      Object.assign(elecErrors[0], {
        mandatePeriodStart: true, mandatePeriodEnd: true
      });
    }
  }
  else {
    elections.forEach((e, index) => {
      const { mandatePeriodStart, mandatePeriodEnd } = e;
      if (mandatePeriodStart && mandatePeriodEnd &&
        mandatePeriodStart >= mandatePeriodEnd) {
        formErrors.mandateDates.push({
          msg: <span>
            {elections[index].name[lang]}:&nbsp;
            <Trans>formErrors.invalidDates</Trans>
          </span>,
          index
        });
        Object.assign(elecErrors[index], {
          mandatePeriodStart: true, mandatePeriodEnd: true
        });
      }
    })
  }

  if (!hasMultipleContactInfo) {
    const { contact } = elections[0];
    if (contact && !validateEmail(contact)) {
      formErrors.contact.push({
        msg: <Trans>formErrors.invalidEmail</Trans>,
        index: 0
      });
      Object.assign(elecErrors[0], { contact: true });
    }
  }
  else {
    elections.forEach((e, index) => {
      const { contact } = e;
      if (contact && !validateEmail(contact)) {
        formErrors.contact.push({
          msg: <span>
            {elections[index].name[lang]}:&nbsp;
            <Trans>formErrors.invalidEmail</Trans>
          </span>,
          index
        });
        Object.assign(elecErrors[index], { contact: true });
      }
    })
  }

  if (!hasMultipleInfoUrls) {
    const { informationUrl } = elections[0];
    if (informationUrl && !validateUrl(informationUrl)) {
      formErrors.informationUrl.push({
        msg: <Trans>formErrors.invalidUrl</Trans>,
        index: 0
      });
      Object.assign(elecErrors[0], { informationUrl: true });
    }
  }
  else {
    elections.forEach((e, index) => {
      const { informationUrl } = e;
      if (informationUrl && !validateUrl(informationUrl)) {
        formErrors.informationUrl.push({
          msg: <span>
            {elections[index].name[lang]}:&nbsp;
            <Trans>formErrors.invalidUrl</Trans>
          </span>,
          index
        });
        Object.assign(elecErrors[index], { informationUrl: true });
      }
    })
  }
  return { elections: elecErrors, formErrors };
};

type Props = {
  electionGroup: ElectionGroup,
  initialValues: Object,
  handleSubmit: Function,
  closeAction: Function,
  t: Function,
  i18n: Object,
  header: ReactElement | string
};

class VoterInfoForm extends React.Component<Props> {
  render() {
    const {
      electionGroup,
      initialValues,
      closeAction,
      t,
      header
    } = this.props;
    const lang = this.props.i18n.language;
    const { elections } = initialValues;
    if (elections.length === 0) {
      return <p><Trans>election.noActiveElections</Trans></p>
    }
    return (
      <Form
        onSubmit={this.props.handleSubmit}
        validate={validate(lang)}
        initialValues={initialValues}
        render={(formProps: Object) => {
          const {
            handleSubmit, reset, submitting, pristine, values, invalid,
            errors, valid, visited, touched
          } = formProps;
          if (!values) {
            return null;
          }
          return (
            <form onSubmit={handleSubmit} >
              <PageSection header={header}
                desc={<Trans>election.voterInfoFormDesc</Trans>}>
                <PageSubSection header={<Trans>election.election</Trans>}>
                  <Text large>{electionGroup.name[lang]}</Text>
                </PageSubSection>

                <PageSubSection header={<Trans>election.mandatePeriod</Trans>}>
                  {elections.length > 1 &&
                    <FormField>
                      <Field
                        name="hasMultipleMandateTimes"
                        component={RadioButtonGroup}
                        key="mandatefields"
                        options={[
                          {
                            id: "single-mandate",
                            value: false,
                            label: <Trans>election.mandatePeriodShared</Trans>
                          },
                          {
                            id: "multiple-mandate",
                            value: true,
                            label: <Trans>election.mandatePeriodMultiple</Trans>
                          }
                        ]}
                      />
                    </FormField>
                  }
                  {values.hasMultipleMandateTimes ?
                    <Table smlTopMargin>
                      <TableHeader>
                        <TableHeaderRow>
                          <TableHeaderCell>
                            <Trans>election.group</Trans>
                          </TableHeaderCell>
                          <TableHeaderCell>
                            <Trans>election.fromDate</Trans>
                          </TableHeaderCell>
                          <TableHeaderCell>
                            <Trans>election.toDate</Trans>
                          </TableHeaderCell>
                        </TableHeaderRow>
                      </TableHeader>
                      <FieldArray
                        name="elections"
                        render={({ fields }) => (
                          <TableBody>
                            {fields.map((election, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Text>
                                    {elections[index].name[lang]}
                                  </Text>
                                </TableCell>
                                <TableCell>
                                  <FormField inline noTopMargin>
                                    <Field
                                      name={`${election}.mandatePeriodStart`}
                                      component={DateInputRF}
                                      small
                                    />
                                  </FormField>
                                </TableCell>
                                <TableCell>
                                  <FormField inline noTopMargin>
                                    <Field
                                      name={`${election}.mandatePeriodEnd`}
                                      component={DateInputRF}
                                      small
                                    />
                                  </FormField>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        )}
                      />
                    </Table> :
                    <FormFieldGroup>
                      <FormField inline noTopMargin>
                        <Field
                          name="elections[0].mandatePeriodStart"
                          component={DateInputRF}
                          label={<Trans>election.fromDate</Trans>}
                        />
                      </FormField>
                      <FormField inline noTopMargin>
                        <Field
                          name="elections[0].mandatePeriodEnd"
                          component={DateInputRF}
                          label={<Trans>election.toDate</Trans>}
                        />
                      </FormField>
                    </FormFieldGroup>
                  }

                  {errors._error.mandateDates.map((error) => {
                    const { msg, index } = error;
                    if (visited[`elections[${index}].mandatePeriodStart`] ||
                      visited[`elections[${index}].mandatePeriodEnd`]) {
                      return <FormErrorMsg key={index} msg={error.msg} />;
                    }
                    return null;
                  })}
                </PageSubSection>

                <PageSubSection header={<Trans>election.voterContactInfo</Trans>}>
                  {elections.length > 1 &&
                    <FormField>
                      <Field
                        name="hasMultipleContactInfo"
                        component={RadioButtonGroup}
                        options={[
                          {
                            id: "single-contact",
                            value: false,
                            label: <Trans>election.voterContactInfoShared</Trans>
                          },
                          {
                            id: "multiple-contact",
                            value: true,
                            label: <Trans>election.voterContactInfoMultiple</Trans>
                          }
                        ]}
                      />
                    </FormField>
                  }
                  {values.hasMultipleContactInfo ?
                    <Table>
                      <TableHeader>
                        <TableHeaderRow>
                          <TableHeaderCell>
                            <Trans>election.group</Trans>
                          </TableHeaderCell>
                          <TableHeaderCell>
                            <Trans>general.contactInfo</Trans>
                          </TableHeaderCell>
                        </TableHeaderRow>
                      </TableHeader>
                      <FieldArray
                        name="elections"
                        render={({ fields }) => (
                          <TableBody>
                            {fields.map((election, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Text>
                                    {elections[index].name[lang]}
                                  </Text>
                                </TableCell>
                                <TableCell>
                                  <FormField noTopMargin>
                                    <Field
                                      name={`${election}.contact`}
                                      component={TextInputRF}
                                      placeholder={t('general.email')}
                                      small
                                    />
                                  </FormField>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        )}
                      />
                    </Table> :
                    <FormField>
                      <Field
                        name="elections[0].contact"
                        component={TextInputRF}
                        label={<Trans>general.contactInfo</Trans>}
                        placeholder={t('general.email')}
                      />
                    </FormField>
                  }
                  {errors._error.contact.map((error) => {
                    const { msg, index } = error;
                    if (touched[`elections[${index}].contact`]) {
                      return <FormErrorMsg key={index} msg={msg} />;
                    }
                    return null;
                  })}
                </PageSubSection>

                <PageSubSection header={<Trans>election.voterInfoUrl</Trans>}>
                  {elections.length > 1 &&
                    <FormField>
                      <Field
                        name="hasMultipleInfoUrls"
                        component={RadioButtonGroup}
                        options={[
                          {
                            id: "single-infourl",
                            value: false,
                            label: <Trans>election.voterInfoUrlShared</Trans>
                          },
                          {
                            id: "multiple-infourl",
                            value: true,
                            label: <Trans>election.voterInfoUrlMultiple</Trans>
                          }
                        ]}
                      />
                    </FormField>
                  }
                  {values.hasMultipleInfoUrls ?
                    <Table>
                      <TableHeader>
                        <TableHeaderRow>
                          <TableHeaderCell>
                            <Trans>election.group</Trans>
                          </TableHeaderCell>
                          <TableHeaderCell>
                            <Trans>election.voterInfoUrl</Trans>
                          </TableHeaderCell>
                        </TableHeaderRow>
                      </TableHeader>
                      <FieldArray
                        name="elections"
                        render={({ fields }) => (
                          <TableBody>
                            {fields.map((election, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Text>
                                    {elections[index].name[lang]}
                                  </Text>
                                </TableCell>
                                <TableCell>
                                  <FormField noTopMargin>
                                    <Field
                                      name={`${election}.informationUrl`}
                                      component={TextInputRF}
                                      placeholder={t('general.webpage')}
                                      small
                                    />
                                  </FormField>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        )}
                      />
                    </Table> :
                    <FormField noTopMargin>
                      <Field
                        name="elections[0].informationUrl"
                        component={TextInputRF}
                        label={<Trans>election.voterInfoUrl</Trans>}
                        placeholder={t('general.webpage')}
                        id="infourl-single"
                      />
                    </FormField>
                  }
                  {errors._error.informationUrl.map((error) => {
                    const { msg, index } = error;
                    if (touched[`elections[${index}].informationUrl`]) {
                      return <FormErrorMsg key={index} msg={error.msg} />;
                    }
                    return null;
                  })}
                </PageSubSection>

                <FormButtons
                  saveAction={handleSubmit}
                  closeAction={closeAction}
                  submitDisabled={pristine || !valid}
                  alignRight
                />
              </PageSection>
            </form>
          )
        }}
      />
    );
  };
}

export default translate()(VoterInfoForm);
