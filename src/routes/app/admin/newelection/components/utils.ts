
interface ElectionSettings {
  name?: string
  template: boolean;
  templateName?: string;
  templateManualFields?: Array<string>;
}

/**
 * Generate an array of required election settings.
 * TODO: The manual settings fields needs to be expanded to support manual elections
 * @param settings Current election settings
 */
export const getRequiredSettings = (settings: ElectionSettings) => {
  const manualSettings = ['group', 'name', 'ouTag'];
  const templateSettings = ['template', 'templateName', 'ouTag'];
  let requiredSettings: Array<string> = [];

  if (settings.template) {
    // Template election
    requiredSettings = requiredSettings.concat(templateSettings);
    if (settings.templateManualFields) {
      requiredSettings = requiredSettings.concat(settings.templateManualFields);
    }
  } else {
    // Manual election
    requiredSettings = manualSettings
  }
  return requiredSettings;
};

getRequiredSettings.defaultProps = {
  templateManualFields: []
}


/**
 * Get the derived ou and name values for a new election
 * @param values Form values
 * @param settings Election template settings
 * @param ouLists Array of units
 */
export const getDerivedValues = (values: any, settings: any, ouLists: any) => {
  let ou = null;
  let name = null;

  Object.keys(values).forEach(valueName => {
    if (valueName.endsWith('ou')) {
      ou = values[valueName].value;
    }
    if (valueName.endsWith('name')) {
      name = values[valueName].value;
    }
  });

  if (ou === null && settings.ouTag === 'root') {
    [ou] = ouLists.root;
  } else if (ou !== null) {
    ou = ouLists[settings.ouTag][ou];
  }
  // const { electionNameTag } = settings;
  // if (name === null && ou !== null && ou.electionNameTags[electionNameTag]) {
  //  name = ou.electionNameTags[electionNameTag]
  // }
  if (name === null && settings.name) {
    ({ name } = settings.name);
  }

  return { ou, name };
}