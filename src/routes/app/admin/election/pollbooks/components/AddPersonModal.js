/* @flow */
import * as React from 'react';
import { reduxForm, Field, FieldArray, formValueSelector, arrayPush } from 'redux-form';


import Modal from 'components/modal/Modal';
import { Trans, translate } from 'react-i18next';
import ActionText from 'components/actiontext';
import { Button } from 'components/button';
import { TextInputRF, FormField, FormFieldGroup } from 'components/form';

const printField = (element, t) => {
  const e = element.input.value
  return (
    <p>{e.firstName + ' ' + e.lastName}</p>
  )
}

const printFields = ({ fields, t }) => {
  return (
    <div>
      {fields.map((e, index) => {
        const removeAction =
          <ActionText action={() => fields.remove(index)}>
            <Trans>general.remove</Trans>
          </ActionText>

        return (
          <FormField key={index}
            action={removeAction}>
            <Field name={e}
              component={x => printField(x, t)}
            />
          </FormField>
        )
      })}
    </div>
  )
}

type CensusListFormProps = {
  t: Object
}

class CensusListForm extends React.Component {
  props: CensusListFormProps

  render() {
    const { t } = this.props
    return (
      <form>
        <FormFieldGroup>
          <FieldArray name="censusMembers"
            component={printFields}
            props={{ t }}
          />
        </FormFieldGroup>
      </form>
    )
  }
}

const CensusListFormMapStateToProps = (state: Object) => {
  return {
    lang: state.i18n.lang,
    t: state.i18n.texts[state.i18n.lang]
  }
}

const CensusListReduxForm = connect(CensusListFormMapStateToProps)(reduxForm({ form: 'CensusListForm' })(CensusListForm))

type CensusAddPersonFormProps = {
  t: Function,
  i18n: Object,
  pollbook: Object,
  handleSubmit: Function,
  closeAction: Function,
  dispatch: Function,
  personSearch: Function,
  createVoter: Function,
  persons: Array<Object>,
  censusMembers: Object
}

class CensusAddPersonForm extends React.Component {
  props: CensusAddPersonFormProps

  findPerson(persons, id, updateAction) {
    if (id in persons) {
      updateAction(persons[id])
    }
    else {
      this.props.personSearch({ nin: id }).then(r => {
        // TODO: HANDLE ERRORS HERE
        // TODO: Present user with list of persons found instead of using first and best
        updateAction(r.response[0])
      })
    }
  }

  render() {
    const { pollbook, createVoter, t, handleSubmit, closeAction, dispatch, persons, censusMembers } = this.props
    return (
      <form>
        <FormField inline>
          <Field name={"inputField"}
            component={TextInputRF}
            placeholder={t('census.addPersonInputPlaceholder')}
          />
          <Button text={t('census.addTo')}
            action={handleSubmit(data => {
              if ('inputField' in data) {
                this.findPerson(persons, data.inputField, response => dispatch(arrayPush('CensusListForm', 'censusMembers', response)))
                delete data.inputField
              }
            })}
          />
        </FormField>
        <Button text={t('general.save')} action={() => null} />
      </form>
    )
  }
}
const censusListFormValueSelector = formValueSelector('CensusListForm')

const CensusAddPersonFormMapStateToProps = (state: Object) => {
  return {
    lang: state.i18n.lang,
    t: state.i18n.texts[state.i18n.lang],
    persons: state.adminPersons.items,
    censusMembers: censusListFormValueSelector(state, 'censusMembers')
  }
}

const CensusAddPersonReduxForm = connect(CensusAddPersonFormMapStateToProps, { arrayPush, personSearch, createVoter })(reduxForm({ form: 'CensusAddPersonForm' })(CensusAddPersonForm))


type AddPersonModalProps = {
  closeAction: Function,
  pollbook: Object,
  lang: string,
  t: Function,
  i18n: Object
}

class AddPersonModal extends React.Component {
  props: AddPersonModalProps;

  cancelAction() {
    this.props.closeAction()
  }

  saveAction() {
    console.error("save")
  }

  deleteAction() {
    console.error("delete all persons inn mantall")
  }

  render() {
    const { closeAction, pollbook, t } = this.props;
    const lang = this.props.i18n.language;
    return (
      <Modal buttons={[]}
        hideButtonSeparator={true}
        closeAction={() => closeAction()}
        header={t('census.addPersons') + ' ' + pollbook.name[lang]}>

        <CensusListReduxForm />
        <CensusAddPersonReduxForm pollbook={pollbook}
          closeAction={closeAction}
        />
      </Modal>
    )
  }
}

export default translate()(AddPersonModal);
