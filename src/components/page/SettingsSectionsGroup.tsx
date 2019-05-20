import React from 'react';
import injectSheet from 'react-jss';
import {
  SettingsSectionDisplayStatus,
  ISettingsSectionContents,
} from './SettingsSection';
import { SettingsSection } from '.';

import { ElectionGroup } from '../../interfaces';

const styles = (theme: any) => ({});

const buildInitialDisplayStatuses = (
  useDirectedFlow: boolean,
  nSettingSections: number
) => {
  const displayStatuses: SettingsSectionDisplayStatus[] = new Array(
    nSettingSections
  );
  if (useDirectedFlow) {
    displayStatuses.fill('minimized');
    displayStatuses[0] = 'active';
  } else {
    displayStatuses.fill('inactive');
  }
  return displayStatuses;
};

interface IProps {
  settingsSectionsContents: ISettingsSectionContents[];
  electionGroupData: ElectionGroup;
  startWithDirectedFlowActive: boolean;
  initialDisplayStatuses?: SettingsSectionDisplayStatus[];
  onSettingsWasSaved: () => void;
}

interface IState {
  isDirectedFlowActive: boolean;
  displayStatuses: SettingsSectionDisplayStatus[];
}

class SettingsSectionsGroup extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isDirectedFlowActive: this.props.startWithDirectedFlowActive,
      displayStatuses: buildInitialDisplayStatuses(
        this.props.startWithDirectedFlowActive,
        this.props.settingsSectionsContents.length
      ),
    };
  }

  handleSettingsWasSaved = () => {
    this.props.onSettingsWasSaved();
    this.updateUIAfterSavingSettings();
  };

  updateUIAfterSavingSettings = () => {
    if (this.state.isDirectedFlowActive) {
      this.activateNextSection();
    } else {
      let displayStatuses = [...this.state.displayStatuses];
      displayStatuses = this.setAllSectionsToInactive(displayStatuses);
      this.setState({ displayStatuses });
    }
  };

  updateUIAfterCancelSettings = () => {
    this.deactivateDirectedFlow();
    let displayStatuses = [...this.state.displayStatuses];
    displayStatuses = this.setAllSectionsToInactive(displayStatuses);
    this.setState({ displayStatuses });
  };

  activateNextSection = () => {
    const displayStatuses = [...this.state.displayStatuses];
    for (let i = 0; i < displayStatuses.length; i++) {
      if (displayStatuses[i] === 'active' && i < displayStatuses.length - 1) {
        displayStatuses[i] = 'inactive';
        displayStatuses[i + 1] = 'active';
        break;
      } else if (
        displayStatuses[i] === 'active' &&
        i === displayStatuses.length - 1
      ) {
        displayStatuses[i] = 'inactive';
      }
    }
    this.setState({ displayStatuses });
  };

  handleManuallySetSectionActive = (sectionIndex: number) => {
    this.deactivateDirectedFlow();
    let displayStatuses = [...this.state.displayStatuses];
    displayStatuses = this.setAllSectionsToInactive(displayStatuses);
    if (sectionIndex >= 0 && sectionIndex < displayStatuses.length) {
      displayStatuses[sectionIndex] = 'active';
    }
    this.setState({ displayStatuses });
  };

  deactivateDirectedFlow = () => {
    if (this.state.isDirectedFlowActive) {
      this.setState({ isDirectedFlowActive: false });
    }
  };

  setAllSectionsToInactive = (
    displayStatuses: SettingsSectionDisplayStatus[]
  ) => {
    for (let i = 0; i < displayStatuses.length; i++) {
      displayStatuses[i] = 'inactive';
    }
    return displayStatuses;
  };

  render() {
    return (
      <div>
        {this.props.settingsSectionsContents.map((sectionContents, index) => (
          <SettingsSection
            key={sectionContents.sectionName}
            sectionIndex={index}
            settingsSectionContents={sectionContents}
            electionGroupData={this.props.electionGroupData}
            displayStatus={this.state.displayStatuses[index]}
            onSetActive={this.handleManuallySetSectionActive}
            onSubmitSettingsSection={this.handleSettingsWasSaved}
            onCloseSettingsSection={this.updateUIAfterCancelSettings}
          />
        ))}
      </div>
    );
  }
}

export default injectSheet(styles)(SettingsSectionsGroup);
