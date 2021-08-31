import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { withTranslation, WithTranslation } from 'react-i18next';

import {
    FormButtons,
    FormField,
    TextInputRF,
} from 'components/form';
import { PageSubSection } from 'components/page';
import { ElectionNameInput, ElectionGroup } from 'interfaces';

// TODO: Finish implementing
const validate = (values: any) => {
  const errors = {};
  return errors;
};

const buildInitialValues = (electionGroup: ElectionGroup) => ({
  electionGroupId: electionGroup.id,
  name: electionGroup.name,
});

interface IProps extends WithTranslation {
  electionGroup: ElectionGroup;
  onSubmit: (electionName: ElectionNameInput) => any;
  closeAction: () => void;
}

class ElectionNameForm extends React.Component<IProps> {
  isSubmitting = false;

  initialValues = buildInitialValues(this.props.electionGroup);

  constructor(props: IProps) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  shouldComponentUpdate() {
    return !this.isSubmitting;
  }

  async handleFormSubmit(submitValues: any) {
    this.isSubmitting = true;
    await this.props.onSubmit(submitValues);
    this.isSubmitting = false;
  }

  render() {
    const { electionGroup, t } = this.props;
    return (
      <Form
        onSubmit={this.handleFormSubmit}
        mutators={{ ...arrayMutators }}
        initialValues={this.initialValues}
        validate={validate}
      >
        {(formProps: FormRenderProps) => {
          const { handleSubmit, valid, submitting } = formProps;
          return (
            <form onSubmit={handleSubmit}>
              <PageSubSection>
                <FormField>
                  <Field
                    name={'name.en'}
                    component={TextInputRF as any}
                    label={t('election.electionNameEN')}
                    placeholder={electionGroup.name.en}
                  />
                </FormField>
                <FormField>
                  <Field
                    name={'name.nb'}
                    component={TextInputRF as any}
                    label={t('election.electionNameNB')}
                    placeholder={electionGroup.name.nb}
                  />
                </FormField>
                <FormField>
                  <Field
                    name={'name.nn'}
                    component={TextInputRF as any}
                    label={t('election.electionNameNN')}
                    placeholder={electionGroup.name.nn}
                  />
                </FormField>
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

export default withTranslation()(ElectionNameForm);
