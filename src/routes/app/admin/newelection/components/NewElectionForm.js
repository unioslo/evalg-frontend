/* @flow */
import * as React from 'react';
import { Form, Field, FormSpy } from 'react-final-form';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { getSupportedLanguages } from 'utils/i18n';
import { translate, Trans } from "react-i18next";

import { isObjEmpty } from 'utils/helpers';
import {
  DropDownRF, FormButtons, FormField, TextInputRF
} from 'components/form';

const buildDropdownOptions = (options: Array<Object>, lang: string) => {
  return options.map((option, index) => ({
    name: option.name[lang], value: index
  }))
};

export const getCurrentValues = (valueObject: Object): Array<string | number> => {
  let currentValues = [];
  if (valueObject) {
    currentValues = Object.keys(valueObject).map(key => (
      valueObject[key]
    ));
  }
  return currentValues;
};

const getNodeListAndSettings = (
  currentValues: Array<number | string>, templateRoot: Object
) => {
  const nodeList = [];
  let settings = {};
  if (currentValues.length === 0) {
    return { nodeList, settings };
  }

  const selectedRootNodeOption = templateRoot.options[currentValues[0]];
  const nextNodes = selectedRootNodeOption.nextNodes;

  if (selectedRootNodeOption.settings) {
    settings = Object.assign(settings, selectedRootNodeOption.settings);
  }

  if (nextNodes) {
    let nextNodeIndex = 0;
    let nodesAdded = 0;
    let curValIndex = 1;
    while (nodesAdded <= currentValues.length - 1) {
      // No next node, which means we're at the end of the template flow
      if (!nextNodes[nextNodeIndex]) {
        nodesAdded++;
      }
      else {
        const nextNode = nextNodes[nextNodeIndex];
        if (currentValues[curValIndex] !== undefined &&
          nextNode.options &&
          nextNode.options[currentValues[curValIndex]] &&
          nextNode.options[currentValues[curValIndex]].settings) {
          const newSettings = nextNode.options[
            currentValues[curValIndex]
          ].settings;
          settings = Object.assign(settings, newSettings);
        }
        // If ouListsLevel is set to 1 (the root-node in the OU tree), we
        // simply skip the OU-search node
        if (!(settings.ouTag &&
          settings.ouTag === 'root' &&
          nextNode.searchInOuTree)) {
          nodeList.push(nextNode);
          nodesAdded++;
          curValIndex++;
        }
        nextNodeIndex++;
      }
    }
  }
  return { nodeList, settings };
};

const renderOptionFields = (
  nodeList: Array<Object>,
  ouLists: Object,
  currentSettings: Object,
  t: Function,
  lang: string) => {
  return nodeList.map((node, index) => {
    if (node.searchInOuTree) {
      const ouTagEntries = ouLists[currentSettings.ouTag];
      const ouOptions = buildDropdownOptions(ouTagEntries, lang);
      return (
        <FormField inline key={index}>
          <Field
            name={`option${index + 2}ou`}
            component={DropDownRF}
            options={ouOptions}
            large
            searchable
            placeholder={t('general.select')}
            label={node.name[lang]}
          />
        </FormField>
      )
    }
    else if (node.setElectionName) {
      return (
        <FormField key={index}>
          <Field
            name={`option${index + 2}name`}
            component={TextInputRF}
            label={node.name[lang]}
          />
        </FormField>
      )
    }
    const nodeOptions = buildDropdownOptions(node.options, lang);
    return (
      <FormField inline key={index}>
        <Field
          label={node.name[lang]}
          component={DropDownRF}
          name={`option${index + 2}`}
          placeholder={t('general.select')}
          options={nodeOptions}
        />
      </FormField>
    )
  })
};

const getDerivedValues = (values: Object, settings: Object, ouLists: Object) => {
  let ou = null;
  let name = null;

  Object.keys(values).forEach(valueName => {
    if (valueName.endsWith('ou')) {
      ou = values[valueName];
    }
    if (valueName.endsWith('name')) {
      name = values[valueName];
    }
  });

  if (ou === null && settings.ouTag === 'root') {
    ou = ouLists.root[0];
  }
  else if (ou !== null) {
    ou = ouLists[settings.ouTag][ou];
  }
  //const { electionNameTag } = settings;
  //if (name === null && ou !== null && ou.electionNameTags[electionNameTag]) {
  //  name = ou.electionNameTags[electionNameTag]
  //}
  if (name === null && settings.name) {
    name = settings.name;
  }
  return { ou, name };
};

// TODO: Manual settings need to be expanded when it becomes an option
const requiredManualSettings = ['name', 'group', 'ouTag'];
const requiredTemplateSettings = ['template', 'templateName', 'ouTag'];

const internalSubmit = (submitAction: Function, electionTemplate: Object) =>
  (values: Object) => {
    const currentValues = getCurrentValues(values);
    const { templateRoot, ouLists, elections } = electionTemplate;
    const { settings } = getNodeListAndSettings(currentValues, templateRoot);
    let { ou, name } = getDerivedValues(values, settings, ouLists);
    if (settings.template && ou) {
      const { ouTag, ...restSettings } = settings;
      submitAction(
        Object.assign({}, restSettings, { ouId: ou.id })
      );
    }
    else if (ou && name) {
      if (typeof name === 'string') {
        const nameObj = {};
        getSupportedLanguages().forEach(lang => {
          nameObj[lang] = name;
        });
        name = nameObj;
      }
      let electionsData = [];
      if (settings.hasMultipleElections) {
        electionsData = elections;
      }
      else {
        electionsData.push({ name, active: true });
      }
      const { ouTag, ...restSettings } = settings;
      submitAction(Object.assign({}, restSettings, {
        name, ouId: ou.id, elections: electionsData
      }));
    }
  }

const validate = (electionTemplate: Object) => (values: Object) => {
  const notFinished = { _error: 'not done' };
  if (isObjEmpty(values)) {
    return notFinished;
  }
  const { templateRoot, ouLists } = electionTemplate;
  const currentValues = getCurrentValues(values);
  const { settings } = getNodeListAndSettings(currentValues, templateRoot);
  let requiredSettings = requiredTemplateSettings;
  if (!settings.template) {
    requiredSettings = requiredManualSettings;
  }
  for (let i = 0; i < requiredSettings.length; i++) {
    if (settings[requiredSettings[i]] === undefined) {
      return notFinished;
    }
  }
  const { ou, name } = getDerivedValues(values, settings, ouLists);
  if (!settings.template && (ou === null || name === null)) {
    return notFinished;
  }
  if (settings.template && ou === null) {
    return notFinished;
  }
  return {};
};

type Props = {
  submitAction: Function,
  electionTemplate: Object,
  cancelAction: Function,
  updateValues: Function,
  initialValues: Object,
  t: Function,
  i18n: Object
};

const NewElectionForm = (props: Props) => {
  const {
    electionTemplate, submitAction, cancelAction, t
  } = props;
  const { templateRoot, ouLists } = electionTemplate;
  const lang = props.i18n.language;
  return (
    <Form onSubmit={internalSubmit(submitAction, electionTemplate)}
      validate={validate(electionTemplate)}
      initialValues={props.initialValues}
      render={(formProps: Object) => {
        const {
          handleSubmit, reset, submitting, pristine, values, invalid
        } = formProps;
        const currentValues = getCurrentValues(values);
        const { nodeList, settings } = getNodeListAndSettings(
          currentValues, templateRoot
        );
        return (
          <form onSubmit={handleSubmit}>
            <FormSpy
              onChange={formState => {
                const { values: formValues, initialValues } = formState;
                if (!formValues || !initialValues) {
                  return;
                }
                if (Object.keys(formValues).length !== Object.keys(initialValues).length) {
                  // A new value was added, push all values as-is
                  props.updateValues(formValues);
                  return;
                }
                // Either a previous value was changed, or this is just a
                // re-render without any real updates, which is ignored.
                let changedValue = '';
                Object.keys(formValues).forEach(key => {
                  if (formValues[key] !== initialValues[key]) {
                    changedValue = key;
                  }
                });
                if (changedValue) {
                  // We need to delete all the subsequent values after the one
                  // that was updated, as they are now invalid.
                  const keptValues = Object.keys(formValues).filter(key =>
                    key <= changedValue
                  );
                  const updatedValues = {};
                  keptValues.forEach(value => {
                    updatedValues[value] = formValues[value];
                  });
                  props.updateValues(updatedValues);
                }
              }}
            />
            <FormField inline>
              <Field
                label={templateRoot.name[lang]}
                name='option1'
                placeholder={t('general.select')}
                component={DropDownRF}
                options={buildDropdownOptions(templateRoot.options, lang)}
              />
            </FormField>

            {renderOptionFields(nodeList, ouLists, settings, t, lang)}

            <FormButtons
              saveAction={handleSubmit}
              closeAction={cancelAction}
              submitDisabled={submitting || invalid}
            />
          </form>
        )
      }}
    />
  )
};

export default translate()(NewElectionForm);
