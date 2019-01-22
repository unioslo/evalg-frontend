import * as React from 'react';
import { translate, Trans } from 'react-i18next';
import { i18n } from 'i18next';
import { Form, Field, FormRenderProps } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

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

const SingleElectionForm = () => {
  return (
    <div>
      <FormFieldGroup>
        <FormField inline={true}>
          <Field
            name="elections[0].startDate"
            component={DateInputRF as any}
            label={<Trans>election.electionOpens</Trans>}
          />
        </FormField>
        <FormField inline={true}>
          <Field
            name="elections[0].startTime"
            component={TimeInputRF as any}
            label="&nbsp;"
          />
        </FormField>
      </FormFieldGroup>
      <FormFieldGroup>
        <FormField inline={true}>
          <Field
            name="elections[0].endDate"
            component={DateInputRF as any}
            label={<Trans>election.electionCloses</Trans>}
          />
        </FormField>
        <FormField inline={true}>
          <Field
            name="elections[0].endTime"
            component={TimeInputRF as any}
            label="&nbsp;"
          />
        </FormField>
      </FormFieldGroup>
    </div>
  );
};

const MultipleElectionsForm = ({
  lang,
  hasMultipleTimes,
  elections,
}: {
  lang: string;
  hasMultipleTimes: boolean;
  elections: Election[];
}) => (
  <>
    <FormField>
      <Field
        name="hasMultipleTimes"
        component={RadioButtonGroup as any}
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
                <TableRow key={`${election}.id`}>
                  <TableCell>
                    <Text>{elections[index].name[lang]}</Text>
                  </TableCell>
                  <TableCell>
                    <FormFieldGroup>
                      <FormField inline={true} noBottomMargin={true}>
                        <Field
                          name={`${election}.startDate`}
                          component={DateInputRF as any}
                          small={true}
                        />
                      </FormField>
                      <FormField inline={true} noBottomMargin={true}>
                        <Field
                          name={`${election}.startTime`}
                          component={TimeInputRF as any}
                          small={true}
                        />
                      </FormField>
                    </FormFieldGroup>
                  </TableCell>
                  <TableCell>
                    <FormFieldGroup>
                      <FormField inline={true} noBottomMargin={true}>
                        <Field
                          name={`${election}.endDate`}
                          component={DateInputRF as any}
                          small={true}
                        />
                      </FormField>
                      <FormField inline={true} noBottomMargin={true}>
                        <Field
                          name={`${election}.endTime`}
                          component={TimeInputRF as any}
                          small={true}
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
  </>
);

const determineFormType = (grpType: string, elections: Election[]) => {
  if (grpType === 'multiple_elections' && elections.length > 1) {
    return MultipleElectionsForm;
  } else {
    return SingleElectionForm;
  }
};

const electionValuesSet = (e: any) =>
  e.startDate && e.startTime && e.endDate && e.endTime;

const validate = (lang: string) => (values: any) => {
  const errors: any = {};
  errors.elections = [];
  const formErrors: any[] = [];
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
    values.elections.forEach((election: any) => {
      let electionErrors;
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

interface IProps {
  onSubmit: (submitValues: any) => void;
  closeAction: () => void;
  electionType: string;
  initialValues: any;
  i18n: i18n;
}

class VotingPeriodForm extends React.Component<IProps> {
  isSubmitting = false;

  constructor(props: IProps) {
    super(props);
  }

  public handleSubmit = async (submitValues: any) => {
    this.isSubmitting = true;
    await this.props.onSubmit(submitValues);
    this.isSubmitting = false;
  };

  public shouldComponentUpdate() {
    return !this.isSubmitting;
  }

  public render() {
    const { closeAction, electionType, initialValues } = this.props;
    const lang = this.props.i18n.language;
    const { elections } = initialValues;
    const PeriodForm = determineFormType(electionType, initialValues.elections);

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
        // tslint:disable-next-line:jsx-no-lambda
        render={(formProps: FormRenderProps) => {
          const { handleSubmit, submitting, values, errors, valid } = formProps;
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
                  {errors._error.map((err: any, index: number) => {
                    return <FormErrorMsg key={index} msg={err} />;
                  })}
                </div>
              )}
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

export default translate()(VotingPeriodForm);
