import React from 'react';
import { Field, Form } from 'react-final-form';
import { Trans } from 'react-i18next';

import { DropDownRF, FormButtons } from 'components/form';
import { DropDownOption } from 'interfaces';

interface IUpdateVoterForm {
  submitAction: (o: any) => void;
  closeAction: () => void;
  deleteAction: () => void;
  options: DropDownOption[];
  initialValues: object;
}

const UpdateVoterForm: React.FunctionComponent<IUpdateVoterForm> = props => {
  const {
    closeAction,
    deleteAction,
    options,
    submitAction,
    initialValues,
  } = props;

  const renderForm = (formProps: any) => {
    const { handleSubmit, pristine, valid } = formProps;
    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="pollbookId"
          component={DropDownRF as any}
          options={options}
        />
        <FormButtons
          saveAction={handleSubmit}
          closeAction={closeAction}
          submitDisabled={pristine || !valid}
          entityAction={deleteAction}
          entityText={<Trans>census.deleteFromCensus</Trans>}
        />
      </form>
    );
  };
  return (
    <Form
      onSubmit={submitAction}
      initialValues={initialValues}
      render={renderForm}
    />
  );
};

export default UpdateVoterForm;
