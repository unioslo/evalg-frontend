/* @flow */
import * as React from 'react';
import { translate, Trans } from 'react-i18next';
import { Form, Field, FormSpy } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import moment from 'moment';

import Text from 'components/text';
import {
  DateInputRF,
  FormErrorMsg,
  FormField,
  FormFieldGroup,
  RadioButtonGroup,
  TimeInputRF,
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

import FormButtons from 'components/form/FormButtons';

import { equalValues } from 'utils';

const SingleElectionForm = () => {
  return (
    <div>
      <FormFieldGroup>
        <FormField inline>
          <Field
            name="elections[0].startDate"
            component={DateInputRF}
            label={<Trans>election.electionOpens</Trans>}
          />
        </FormField>
        <FormField inline>
          <Field
            name="elections[0].startTime"
            component={TimeInputRF}
            label="&nbsp;"
          />
        </FormField>
      </FormFieldGroup>
      <FormFieldGroup>
        <FormField inline>
          <Field
            name="elections[0].endDate"
            component={DateInputRF}
            label={<Trans>election.electionCloses</Trans>}
          />
        </FormField>
        <FormField inline>
          <Field
            name="elections[0].endTime"
            component={TimeInputRF}
            label="&nbsp;"
          />
        </FormField>
      </FormFieldGroup>
    </div>
  );
};

const MultipleElectionsForm = ({ lang, hasMultipleTimes, elections }) => {
  return (
    <div>
      <FormField>
        <Field
          name="hasMultipleTimes"
          component={RadioButtonGroup}
          options={[
            {
              id: 'singleperiod',
              value: false,
              label: <Trans>election.singleVotingPeriod</Trans>,
            },
            {
              id: 'multipleperiods',
              value: true,
              label: <Trans>election.multipleVotingPeriods</Trans>,
            },
          ]}
        />
      </FormField>
      {hasMultipleTimes ? (
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>
                <Trans>election.group</Trans>
              </TableHeaderCell>
              <TableHeaderCell>
                <Trans>election.electionOpens</Trans>
              </TableHeaderCell>
              <TableHeaderCell>
                <Trans>election.electionCloses</Trans>
              </TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            <FieldArray name="elections">
              {({ fields }) =>
                fields.map((election, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Text>{elections[index].name[lang]}</Text>
                    </TableCell>
                    <TableCell>
                      <FormFieldGroup>
                        <FormField inline noBottomMargin>
                          <Field
                            name={`${election}.startDate`}
                            component={DateInputRF}
                            small
                          />
                        </FormField>
                        <FormField inline noBottomMargin>
                          <Field
                            name={`${election}.startTime`}
                            component={TimeInputRF}
                            small
                          />
                        </FormField>
                      </FormFieldGroup>
                    </TableCell>
                    <TableCell>
                      <FormFieldGroup>
                        <FormField inline noBottomMargin>
                          <Field
                            name={`${election}.endDate`}
                            component={DateInputRF}
                            small
                          />
                        </FormField>
                        <FormField inline noBottomMargin>
                          <Field
                            name={`${election}.endTime`}
                            component={TimeInputRF}
                            small
                          />
                        </FormField>
                      </FormFieldGroup>
                    </TableCell>
                  </TableRow>
                ))
              }
            </FieldArray>
          </TableBody>
        </Table>
      ) : (
        <SingleElectionForm />
      )}
    </div>
  );
};

const determineFormType = (grpType: string, elections: Array<Election>) => {
  if (grpType === 'multiple_elections' && elections.length > 1) {
    return MultipleElectionsForm;
  } else {
    return SingleElectionForm;
  }
};

const electionValuesSet = e =>
  e.startDate && e.startTime && e.endDate && e.endTime;

const validate = (lang: string) => (values: Object) => {
  const errors = {};
  errors.elections = [];
  const formErrors = [];
  const { hasMultipleTimes, elections } = values;
  if (!hasMultipleTimes && electionValuesSet(elections[0])) {
    const { startDate, startTime, endDate, endTime } = elections[0];
    const startDateTime = startDate + startTime;
    const endDateTime = endDate + endTime;
    if (startDateTime >= endDateTime) {
      formErrors.push(<Trans>formErrors.invalidDates</Trans>);
      Object.assign(errors, {
        elections: [
          { startDate: true, startTime: true, endDate: true, endTime: true },
        ],
      });
    }
  } else {
    values.elections.forEach(election => {
      let electionErrors = undefined;
      if (electionValuesSet(election)) {
        const { startTime, startDate, endTime, endDate } = election;
        const startDateTime = startDate + startTime;
        const endDateTime = endDate + endTime;
        if (startDateTime >= endDateTime) {
          formErrors.push(
            <span>
              {election.name[lang]}: <Trans>formErrors.invalidDates</Trans>
            </span>
          );
          electionErrors = {
            startDate: true,
            startTime: true,
            endDate: true,
            endTime: true,
          };
        }
      }
      errors.elections.push(electionErrors);
    });
  }
  if (formErrors.length > 0) {
    errors._error = formErrors;
  }
  return errors;
};

type Props = {
  onSubmit: Function,
  closeAction: Function,
  electionType: string,
  initialValues: Object,
  i18n: Object,
};

class VotingPeriodForm extends React.Component<Props> {
  render() {
    const { onSubmit, closeAction, electionType, initialValues } = this.props;
    const lang = this.props.i18n.language;
    const { elections } = initialValues;
    const PeriodForm = determineFormType(electionType, initialValues.elections);

    const electionNames = elections.map(e => ({ ...e.name }));
    if (elections.length === 0) {
      return (
        <p>
          <Trans>election.noActiveElections</Trans>
        </p>
      );
    }
    return (
      <Form
        onSubmit={this.props.onSubmit}
        validate={validate(lang)}
        initialValues={initialValues}
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
          // initialValues will not be injected on initial render
          if (values === undefined) {
            return null;
          }
          return (
            <form onSubmit={handleSubmit}>
              <PeriodForm
                lang={lang}
                elections={elections}
                hasMultipleTimes={values.hasMultipleTimes}
              />
              {errors && errors._error && (
                <div>
                  {errors._error.map((err, index) => {
                    return <FormErrorMsg key={index} msg={err} />;
                  })}
                </div>
              )}
              <FormButtons
                saveAction={handleSubmit}
                closeAction={closeAction}
                submitDisabled={!valid}
              />
            </form>
          );
        }}
      />
    );
  }
}

export default translate()(VotingPeriodForm);
