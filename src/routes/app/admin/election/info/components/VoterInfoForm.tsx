import * as React from 'react';
import arrayMutators from 'final-form-arrays';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Trans, translate, TranslationFunction } from 'react-i18next';
import { i18n } from 'i18next';

import {
  DateInputRF,
  FormButtons,
  FormErrorMsg,
  FormField,
  FormFieldGroup,
  RadioButtonGroup,
  TextInputRF,
} from 'components/form';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from 'components/table';

import { validateEmail, validateUrl } from 'utils/validators';

import { PageSubSection } from 'components/page';
import Text from 'components/text';

const validate = (lang: string) => (values: any) => {
  const elecErrors: any[] = [];
  values.elections.forEach((e: any) => elecErrors.push({}));
  const formErrors: any = {
    mandateDates: [],
    contact: [],
    informationUrl: [],
  };
  const {
    elections,
    hasMultipleMandateTimes,
    hasMultipleContactInfo,
    hasMultipleInfoUrls,
  } = values;

  if (!hasMultipleMandateTimes) {
    const { mandatePeriodStart, mandatePeriodEnd } = elections[0];
    if (
      mandatePeriodStart &&
      mandatePeriodEnd &&
      mandatePeriodStart >= mandatePeriodEnd
    ) {
      formErrors.mandateDates.push({
        msg: <Trans>formErrors.invalidDates</Trans>,
        index: 0,
      });
      Object.assign(elecErrors[0], {
        mandatePeriodStart: true,
        mandatePeriodEnd: true,
      });
    }
  } else {
    elections.forEach((e: any, index: number) => {
      const { mandatePeriodStart, mandatePeriodEnd } = e;
      if (
        mandatePeriodStart &&
        mandatePeriodEnd &&
        mandatePeriodStart >= mandatePeriodEnd
      ) {
        formErrors.mandateDates.push({
          msg: (
            <span>
              {elections[index].name[lang]}:&nbsp;
              <Trans>formErrors.invalidDates</Trans>
            </span>
          ),
          index,
        });
        Object.assign(elecErrors[index], {
          mandatePeriodStart: true,
          mandatePeriodEnd: true,
        });
      }
    });
  }

  if (!hasMultipleContactInfo) {
    const { contact } = elections[0];
    if (contact && !validateEmail(contact)) {
      formErrors.contact.push({
        msg: <Trans>formErrors.invalidEmail</Trans>,
        index: 0,
      });
      Object.assign(elecErrors[0], { contact: true });
    }
  } else {
    elections.forEach((e: any, index: number) => {
      const { contact } = e;
      if (contact && !validateEmail(contact)) {
        formErrors.contact.push({
          msg: (
            <span>
              {elections[index].name[lang]}:&nbsp;
              <Trans>formErrors.invalidEmail</Trans>
            </span>
          ),
          index,
        });
        Object.assign(elecErrors[index], { contact: true });
      }
    });
  }

  if (!hasMultipleInfoUrls) {
    const { informationUrl } = elections[0];
    if (informationUrl && !validateUrl(informationUrl)) {
      formErrors.informationUrl.push({
        msg: <Trans>formErrors.invalidUrl</Trans>,
        index: 0,
      });
      Object.assign(elecErrors[0], { informationUrl: true });
    }
  } else {
    elections.forEach((e: any, index: number) => {
      const { informationUrl } = e;
      if (informationUrl && !validateUrl(informationUrl)) {
        formErrors.informationUrl.push({
          msg: (
            <span>
              {elections[index].name[lang]}:&nbsp;
              <Trans>formErrors.invalidUrl</Trans>
            </span>
          ),
          index,
        });
        Object.assign(elecErrors[index], { informationUrl: true });
      }
    });
  }
  return { elections: elecErrors, formErrors };
};

interface IProps {
  electionGroup: ElectionGroup;
  initialValues: any;
  onSubmit: (submitValues: any) => void;
  closeAction: () => void;
  t: TranslationFunction;
  i18n: i18n;
}

class VoterInfoForm extends React.Component<IProps> {
  isSubmitting = false;

  handleSubmit = async (submitValues: any) => {
    this.isSubmitting = true;
    await this.props.onSubmit(submitValues);
    this.isSubmitting = false;
  };

  shouldComponentUpdate() {
    return !this.isSubmitting;
  }

  render() {
    const { electionGroup, initialValues, closeAction, t } = this.props;
    const lang = this.props.i18n.language;
    const { elections } = initialValues;
    if (elections.length === 0) {
      return (
        <p>
          <Trans>election.noActiveElections</Trans>
        </p>
      );
    }
    return (
      <Form
        onSubmit={this.handleSubmit}
        validate={validate(lang)}
        initialValues={initialValues}
        mutators={arrayMutators as any}
        // tslint:disable-next-line:jsx-no-lambda
        render={(formProps: FormRenderProps) => {
          const {
            handleSubmit,
            submitting,
            values,
            errors,
            valid,
            visited,
            touched,
          } = formProps;
          if (!values) {
            return null;
          }
          return (
            <form onSubmit={handleSubmit}>
              <PageSubSection header={<Trans>election.election</Trans>}>
                <Text large={true}>{electionGroup.name[lang]}</Text>
              </PageSubSection>

              <PageSubSection header={<Trans>election.mandatePeriod</Trans>}>
                {elections.length > 1 && (
                  <FormField>
                    <Field
                      name="hasMultipleMandateTimes"
                      component={RadioButtonGroup as any}
                      key="mandatefields"
                      options={[
                        {
                          id: 'single-mandate',
                          value: false,
                          label: <Trans>election.mandatePeriodShared</Trans>,
                        },
                        {
                          id: 'multiple-mandate',
                          value: true,
                          label: <Trans>election.mandatePeriodMultiple</Trans>,
                        },
                      ]}
                    />
                  </FormField>
                )}
                {values.hasMultipleMandateTimes ? (
                  <Table smlTopMargin={true}>
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
                                <Text>{elections[index].name[lang]}</Text>
                              </TableCell>
                              <TableCell>
                                <FormField inline={true} noTopMargin={true}>
                                  <Field
                                    name={`${election}.mandatePeriodStart`}
                                    component={DateInputRF as any}
                                    small={true}
                                  />
                                </FormField>
                              </TableCell>
                              <TableCell>
                                <FormField inline={true} noTopMargin={true}>
                                  <Field
                                    name={`${election}.mandatePeriodEnd`}
                                    component={DateInputRF as any}
                                    small={true}
                                  />
                                </FormField>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      )}
                    />
                  </Table>
                ) : (
                  <FormFieldGroup>
                    <FormField inline={true} noTopMargin={true}>
                      <Field
                        name="elections[0].mandatePeriodStart"
                        component={DateInputRF as any}
                        label={<Trans>election.fromDate</Trans>}
                      />
                    </FormField>
                    <FormField inline={true} noTopMargin={true}>
                      <Field
                        name="elections[0].mandatePeriodEnd"
                        component={DateInputRF as any}
                        label={<Trans>election.toDate</Trans>}
                      />
                    </FormField>
                  </FormFieldGroup>
                )}

                {errors._error
                  ? errors._error.mandateDates.map((error: any) => {
                      const { index } = error;
                      if (
                        visited &&
                        (visited[`elections[${index}].mandatePeriodStart`] ||
                          visited[`elections[${index}].mandatePeriodEnd`])
                      ) {
                        return <FormErrorMsg key={index} msg={error.msg} />;
                      }
                      return null;
                    })
                  : null}
              </PageSubSection>

              <PageSubSection header={<Trans>election.voterContactInfo</Trans>}>
                {elections.length > 1 && (
                  <FormField>
                    <Field
                      name="hasMultipleContactInfo"
                      component={RadioButtonGroup as any}
                      options={[
                        {
                          id: 'single-contact',
                          value: false,
                          label: <Trans>election.voterContactInfoShared</Trans>,
                        },
                        {
                          id: 'multiple-contact',
                          value: true,
                          label: (
                            <Trans>election.voterContactInfoMultiple</Trans>
                          ),
                        },
                      ]}
                    />
                  </FormField>
                )}
                {values.hasMultipleContactInfo ? (
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
                                <Text>{elections[index].name[lang]}</Text>
                              </TableCell>
                              <TableCell>
                                <FormField noTopMargin={true}>
                                  <Field
                                    name={`${election}.contact`}
                                    component={TextInputRF as any}
                                    placeholder={t('general.email')}
                                    small={true}
                                  />
                                </FormField>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      )}
                    />
                  </Table>
                ) : (
                  <FormField>
                    <Field
                      name="elections[0].contact"
                      component={TextInputRF as any}
                      placeholder={t('general.email')}
                    />
                  </FormField>
                )}
                {errors._error
                  ? errors._error.contact.map((error: any) => {
                      const { msg, index } = error;
                      if (touched && touched[`elections[${index}].contact`]) {
                        return <FormErrorMsg key={index} msg={msg} />;
                      }
                      return null;
                    })
                  : null}
              </PageSubSection>

              <PageSubSection header={<Trans>election.voterInfoUrl</Trans>}>
                {elections.length > 1 && (
                  <FormField>
                    <Field
                      name="hasMultipleInfoUrls"
                      component={RadioButtonGroup as any}
                      options={[
                        {
                          id: 'single-infourl',
                          value: false,
                          label: <Trans>election.voterInfoUrlShared</Trans>,
                        },
                        {
                          id: 'multiple-infourl',
                          value: true,
                          label: <Trans>election.voterInfoUrlMultiple</Trans>,
                        },
                      ]}
                    />
                  </FormField>
                )}
                {values.hasMultipleInfoUrls ? (
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
                                <Text>{elections[index].name[lang]}</Text>
                              </TableCell>
                              <TableCell>
                                <FormField noTopMargin={true}>
                                  <Field
                                    name={`${election}.informationUrl`}
                                    component={TextInputRF as any}
                                    placeholder={t('general.webpage')}
                                    small={true}
                                  />
                                </FormField>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      )}
                    />
                  </Table>
                ) : (
                  <FormField>
                    <Field
                      name="elections[0].informationUrl"
                      component={TextInputRF as any}
                      placeholder={t('general.webpage')}
                      id="infourl-single"
                    />
                  </FormField>
                )}
                {errors._error
                  ? errors._error.informationUrl.map((error: any) => {
                      const { index } = error;
                      if (
                        touched &&
                        touched[`elections[${index}].informationUrl`]
                      ) {
                        return <FormErrorMsg key={index} msg={error.msg} />;
                      }
                      return null;
                    })
                  : null}
              </PageSubSection>

              <FormButtons
                saveAction={handleSubmit}
                closeAction={closeAction}
                submitDisabled={!valid || submitting}
                submitting={submitting}
              />
            </form>
          );
        }}
      />
    );
  }
}

export default translate()(VoterInfoForm);
