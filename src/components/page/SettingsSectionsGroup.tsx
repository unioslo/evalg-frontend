import * as React from 'react';
import injectSheet from 'react-jss';
import {
  SettingsSectionDisplayStatus,
  ISettingsSectionContents,
} from './SettingsSection';
import { SettingsSection } from '.';

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
  initialDisplayStatuses: SettingsSectionDisplayStatus[];
  handleSubmitSettingsSection: () => void;
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

  public handleSaveSettingSection = () => {
    this.props.handleSubmitSettingsSection();
    if (this.state.isDirectedFlowActive) {
      this.activateNextSection();
    } else {
      let displayStatuses = [...this.state.displayStatuses];
      displayStatuses = this.setAllSectionsToInactive(displayStatuses);
      this.setState({ displayStatuses });
    }
  };

  public activateNextSection = () => {
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

  public handleManuallySetSectionActive = (sectionIndex: number) => {
    this.deactivateDirectedFlow();
    let displayStatuses = [...this.state.displayStatuses];
    displayStatuses = this.setAllSectionsToInactive(displayStatuses);
    if (sectionIndex >= 0 && sectionIndex < displayStatuses.length) {
      displayStatuses[sectionIndex] = 'active';
    }
    this.setState({ displayStatuses });
  };

  public handleCloseSettingsSection = () => {
    this.deactivateDirectedFlow();
    let displayStatuses = [...this.state.displayStatuses];
    displayStatuses = this.setAllSectionsToInactive(displayStatuses);
    this.setState({ displayStatuses });
  };

  public deactivateDirectedFlow = () => {
    if (this.state.isDirectedFlowActive) {
      this.setState({ isDirectedFlowActive: false });
    }
  };

  public setAllSectionsToInactive = (
    displayStatuses: SettingsSectionDisplayStatus[]
  ) => {
    for (let i = 0; i < displayStatuses.length; i++) {
      displayStatuses[i] = 'inactive';
    }
    return displayStatuses;
  };

  public render() {
    return this.props.settingsSectionsContents.map((sectionContents, index) => (
      <SettingsSection
        key={sectionContents.sectionName}
        sectionIndex={index}
        settingsSectionContents={sectionContents}
        electionGroupData={this.props.electionGroupData}
        // desc={
        //   sectionData.descriptionNoActiveElections &&
        //   activeElections.length === 0
        //     ? sectionData.descriptionNoActiveElections
        //     : sectionData.description
        // }
        displayStatus={this.state.displayStatuses[index]}
        onSetActive={this.handleManuallySetSectionActive}
        onSubmitSettingsSection={this.handleSaveSettingSection}
        onCloseSettingsSection={this.handleCloseSettingsSection}
      />
    ));
  }
}

export default injectSheet(styles)(SettingsSectionsGroup);
