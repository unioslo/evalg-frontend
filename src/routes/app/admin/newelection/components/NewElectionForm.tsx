import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, FormRenderProps, FormSpy, Field } from 'react-final-form';

import {
  FormField,
  FormButtons,
  TextInput,
  SelectDropDown,
} from 'components/form';
import { getSupportedLanguages } from 'utils/i18n';
import { isObjEmpty } from 'utils/helpers';
import { getDerivedValues, getRequiredSettings } from './utils';

interface IProps {
  submitAction: (v: any) => any;
  electionTemplate: any;
  cancelAction: () => void;
  updateValues: (newVals: any) => void;
  initialValues: object;
}

const buildDropdownOptions = (options: any[], lang: string) => {
  // Create the drop down options
  //if (!options) {
  //  debugger;
  //}
  return options
    .map((option, index) => ({
      label:
        option.name[lang] +
        (option.externalId ? ` ( ${option.externalId} )` : ''),
      value: index,
    }))
    .sort((a, b) => (a.label > b.label ? 1 : -1));
};

export const getCurrentValues = (valueObject: any): Array<string | number> => {
  let currentValues: any[] = [];
  if (valueObject) {
    currentValues = Object.keys(valueObject).map(key => valueObject[key]);
  }

  return currentValues;
};

const getNodeListAndSettings = (currentValues: any[], templateRoot: any) => {
  // Generates a list of the settings nodes
  const nodeList: any[] = [];
  let settings: any = {};
  if (currentValues.length === 0 || !templateRoot.options) {
    return { nodeList, settings };
  }

  const selectedRootNodeOption = templateRoot.options[currentValues[0].value];
  const { nextNodes } = selectedRootNodeOption;
  if (!selectedRootNodeOption.settings) {
    return { nodeList, settings };
  }
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
        nodesAdded += 1;
      } else {
        const nextNode = nextNodes[nextNodeIndex];
        if (currentValues[curValIndex] !== undefined) {
          // Next node is a drop down menu
          if (
            nextNode.options &&
            nextNode.options[currentValues[curValIndex].value] &&
            nextNode.options[currentValues[curValIndex].value].settings
          ) {
            const newSettings =
              nextNode.options[currentValues[curValIndex].value].settings;
            settings = Object.assign(settings, newSettings);
          } else if (nextNode.setElectionName) {
            settings = Object.assign(settings, nextNode.settings);
          }
        }

        // If ouListsLevel is set to 1 (the root-node in the OU tree), we
        // simply skip the OU-search node
        if (
          !(
            settings.ouTag &&
            settings.ouTag === 'root' &&
            nextNode.searchInOuTree
          )
        ) {
          nodeList.push(nextNode);
          nodesAdded += 1;
          curValIndex += 1;
        }
        nextNodeIndex += 1;
      }
    }
  }

  return { nodeList, settings };
};

const renderOptionFields = (
  nodeList: any[],
  ouLists: any,
  currentSettings: any,
  t: (s: string) => string,
  lang: string
) => {
  return nodeList.map((node, index) => {
    if (node.searchInOuTree) {
      const ouTagEntries = ouLists[currentSettings.ouTag];
      const ouOptions = buildDropdownOptions(ouTagEntries, lang);
      return (
        <FormField inline key={index}>
          <Field
            label={node.name[lang]}
            name={`option${index + 2}ou`}
            component={SelectDropDown as any}
            options={ouOptions}
            large
            isSearchable
            placeholder={t('general.selectOrSearch')}
          />
        </FormField>
      );
    } else if (node.setElectionName) {
      return (
        <React.Fragment key="selectElectionName">
          <FormField key="name-select-nb">
            <Field
              name={`option${index + 2}name.value.nb`}
              label={node.name[lang].nb}
            >
              {props => (
                <TextInput
                  value={props.value}
                  name={props.input.name}
                  onChange={props.input.onChange}
                  label={node.name[lang].nb}
                />
              )}
            </Field>
          </FormField>
          <FormField key="name-select-nn">
            <Field
              name={`option${index + 2}name.value.nn`}
              label={node.name[lang].nn}
            >
              {props => (
                <TextInput
                  value={props.value}
                  name={props.input.name}
                  onChange={props.input.onChange}
                  label={node.name[lang].nn}
                />
              )}
            </Field>
          </FormField>
          <FormField key="name-select-en">
            <Field
              name={`option${index + 2}name.value.en`}
              label={node.name[lang].en}
            >
              {props => (
                <TextInput
                  value={props.value}
                  name={props.input.name}
                  onChange={props.input.onChange}
                  label={node.name[lang].en}
                />
              )}
            </Field>
          </FormField>
        </React.Fragment>
      );
    }
    const nodeOptions = buildDropdownOptions(node.options, lang);
    return (
      <FormField inline key={index}>
        <Field
          label={node.name[lang]}
          component={SelectDropDown as any}
          name={`option${index + 2}`}
          placeholder={t('general.select')}
          options={nodeOptions}
        />
      </FormField>
    );
  });
};

const internalSubmit = (
  submitAction: (v: any) => any,
  electionTemplate: any
) => (values: object) => {
  const currentValues = getCurrentValues(values);
  const { templateRoot, ouLists, elections } = electionTemplate;
  const { settings } = getNodeListAndSettings(currentValues, templateRoot);
  const ret = getDerivedValues(values, settings, ouLists);
  const { ou } = ret;
  let { name } = ret;

  if (settings.template && ou) {
    const { ouTag, ...restSettings } = settings;

    if (name) {
      // Manual election name
      restSettings.name = Object.keys(name).map((k: string) => ({
        language: k,
        name: name[k],
      }));
    } else {
      restSettings.name = [];
    }
    submitAction({ ...restSettings, ouId: ou.id });
  } else if (ou && name) {
    if (typeof name === 'string') {
      const nameObj: any = {};
      getSupportedLanguages().forEach(lang => {
        nameObj[lang] = name;
      });
      name = nameObj;
    }
    let electionsData = [];
    if (settings.hasMultipleElections) {
      electionsData = elections;
    } else {
      electionsData.push({ name, active: true });
    }
    const { ouTag, ...restSettings } = settings;
    submitAction(
      Object.assign({}, restSettings, {
        name,
        ouId: ou.id,
        elections: electionsData,
      })
    );
  }
};

// TODO: Manual settings need to be expanded when it becomes an option

const validate = (electionTemplate: any) => (values: object) => {
  const notFinished = { _error: 'not done' };
  if (isObjEmpty(values)) {
    return notFinished;
  }
  const { templateRoot, ouLists } = electionTemplate;
  const currentValues = getCurrentValues(values);
  const { settings } = getNodeListAndSettings(currentValues, templateRoot);
  const requiredSettings = getRequiredSettings(settings);

  // Check if all we have all of the required settings
  if (
    requiredSettings.some(
      (requiredSetting: string) => settings[requiredSetting] === undefined
    )
  ) {
    return notFinished;
  }

  const { ou, name } = getDerivedValues(values, settings, ouLists);
  if (!settings.template && (ou === null || name === null)) {
    return notFinished;
  }

  if (requiredSettings.includes('name')) {
    if (name === null) {
      return notFinished;
    }
    // Check if we have a name in all supported languages
    if (getSupportedLanguages().some((lang: string) => !(lang in name))) {
      return notFinished;
    }
  }
  if (settings.template && ou === null) {
    return notFinished;
  }
  return {};
};

const NewElectionForm: React.FunctionComponent<IProps> = (props: IProps) => {
  const { electionTemplate, submitAction, cancelAction } = props;
  const { templateRoot, ouLists } = electionTemplate;
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  return (
    <Form
      onSubmit={internalSubmit(submitAction, electionTemplate)}
      validate={validate(electionTemplate)}
      initialValues={props.initialValues}
      render={(formProps: FormRenderProps) => {
        const {
          handleSubmit,
          // reset,
          submitting,
          // pristine,
          values,
          invalid,
          form,
        } = formProps;

        const currentValues = getCurrentValues(values);
        const { nodeList, settings } = getNodeListAndSettings(
          currentValues,
          templateRoot
        );

        return (
          <form onSubmit={handleSubmit}>
            <FormSpy
              onChange={formState => {
                const { values: formValues, initialValues } = formState;
                if (!formValues || !initialValues) {
                  // no changes?
                  return;
                }
                if (
                  Object.keys(formValues).length !==
                  Object.keys(initialValues).length
                ) {
                  // A new value is added, push all values as-is.
                  props.updateValues(formValues);
                }

                // Either a previous value was changed, or this is hus a
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
                  const keptValues = Object.keys(formValues).filter(
                    key => key <= changedValue
                  );
                  const updatedValues: any = {};
                  keptValues.forEach(key => {
                    updatedValues[key] = formValues[key];
                  });

                  if (Object.keys(updatedValues).length === 1) {
                    // If we jump back to the start, we need to clear any manually
                    // inputs in the field.
                    form.reset();
                  }
                  props.updateValues(updatedValues);
                }
              }}
            />
            <FormField inline>
              <Field
                label={templateRoot.name[lang]}
                name="option1"
                placeholder={t('general.select')}
                component={SelectDropDown as any}
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
        );
      }}
    />
  );
};

export default NewElectionForm;
