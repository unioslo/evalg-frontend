
import * as React from 'react';
import { getScreenSize, mediaQueryMd, mediaQueryLg } from "utils/responsive";

import Text from 'components/text';
import { Trans } from 'react-i18next';;
import VoterElectionsList from './VoterElectionsList';
import VoterElectionsTable from './VoterElectionsTable';
import { MobileDropDown, MobileDropdownItem } from 'components/dropdownMenu';
import { TabSelector, Tab } from "./TabSelector";

type State = {
  screenSize: "sm" | "md" | "lg",
  electionStatusFilter: string
}

type Props = {
  electionGroups: Array<ElectionGroup>,
}

class VoterElections extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { screenSize: "sm", electionStatusFilter: 'ongoing' };
  }
  componentDidMount() {
    mediaQueryMd.addListener(this.setScreenSize.bind(this));
    mediaQueryLg.addListener(this.setScreenSize.bind(this));
    this.setScreenSize();
  }

  componentWillUnmount() {
    mediaQueryMd.removeListener(this.setScreenSize.bind(this));
    mediaQueryLg.removeListener(this.setScreenSize.bind(this));
  }

  setScreenSize() {
    this.setState({ screenSize: getScreenSize(mediaQueryMd, mediaQueryLg) });
  }

  setElectionStatusFilter(value) {
    this.setState({ electionStatusFilter: value })
  }

  render() {
    const { electionGroups, elections } = this.props;
    const groups = electionGroups.filter(e => {
      if (this.state.electionStatusFilter === 'announced') {
        return e.status === 'announced' ||
          e.status === 'published'
      }
      return e.status === this.state.electionStatusFilter
    }
    );

    let noElectionsText = <Trans>general.noOngoingElections</Trans>;

    if (this.state.electionStatusFilter === 'announced') {
      noElectionsText = <Trans>general.noUpcomingElections</Trans>;
    }
    else if (this.state.electionStatusFilter === 'closed') {
      noElectionsText = <Trans>general.noClosedElections</Trans>;
    }

    if (this.state.screenSize === 'lg') {
      return (
        <div>
          <TabSelector>
            <Tab
              text={<Trans>electionStatus.ongoingElections</Trans>}
              onClick={this.setElectionStatusFilter.bind(this, 'ongoing')}
              active={this.state.electionStatusFilter === 'ongoing'}
            />
            <Tab
              text={<Trans>electionStatus.upcomingElections</Trans>}
              onClick={this.setElectionStatusFilter.bind(this, 'announced')}
              active={this.state.electionStatusFilter === 'announced'}
            />
            <Tab
              text={<Trans>electionStatus.closedElections</Trans>}
              onClick={this.setElectionStatusFilter.bind(this, 'closed')}
              active={this.state.electionStatusFilter === 'closed'}
            />
          </TabSelector>
          <VoterElectionsTable
            electionGroups={groups}
            noElectionsText={noElectionsText}
          />
        </div>
      )
    }
    let dropdownText = <Trans>electionStatus.ongoingElections</Trans>;
    if (this.state.electionStatusFilter === 'announced') {
      dropdownText = <Trans>electionStatus.upcomingElections</Trans>;
    }
    else if (this.state.electionStatusFilter === 'closed') {
      dropdownText = <Trans>electionStatus.closedElections</Trans>;
    }

    return (
      <div>
        <MobileDropDown largeArrow
          text={<Text size="xlarge" bold>{dropdownText}</Text>}>
          <MobileDropdownItem
            active={this.state.electionStatusFilter === 'ongoing'}
            onClick={this.setElectionStatusFilter.bind(this, 'ongoing')}>
            <Trans>electionStatus.ongoingElections</Trans>
          </MobileDropdownItem>
          <MobileDropdownItem
            active={this.state.electionStatusFilter === 'announced'}
            onClick={this.setElectionStatusFilter.bind(this, 'announced')}>
            <Trans>electionStatus.upcomingElections</Trans>
          </MobileDropdownItem>
          <MobileDropdownItem
            active={this.state.electionStatusFilter === 'closed'}
            onClick={this.setElectionStatusFilter.bind(this, 'closed')}>
            <Trans>electionStatus.closedElections</Trans>
          </MobileDropdownItem>
        </MobileDropDown>
        <VoterElectionsList
          electionGroups={groups}
          noElectionsText={noElectionsText}
        />
      </div>
    )
  }
}

export default VoterElections;