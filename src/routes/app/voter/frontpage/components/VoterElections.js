import * as React from 'react';
import { Trans } from 'react-i18next';

import Text from 'components/text';
import VoterElectionsList from './VoterElectionsList';
import VoterElectionsTable from './VoterElectionsTable';
import { MobileDropDown, MobileDropdownItem } from 'components/dropdownMenu';
import { TabSelector, Tab } from './TabSelector';
import { ScreenSizeConsumer } from 'providers/ScreenSize';

// type Props = {
//   electionGroups: Array<ElectionGroup>,
// };

// type State = {
//   electionStatusFilter: string,
// };

class VoterElections extends React.Component {
  constructor(props) {
    super(props);
    this.setElectionStatusFilter = this.setElectionStatusFilter.bind(this);
    this.filterElectionGroups = this.filterElectionGroups.bind(this);

    this.state = { electionStatusFilter: 'ongoing' };
  }

  setElectionStatusFilter(value) {
    this.setState({ electionStatusFilter: value });
  }

  filterElectionGroups(electionGroups, filter) {
    const statusesForFilter = {
      ongoing: ['ongoing'],
      announced: ['announced', 'published'],
      closed: ['closed'],
    };

    const filteredGroups = electionGroups.filter(
      eg =>
        statusesForFilter[filter].indexOf(eg.status) !== -1 ||
        (eg.status === 'multipleStatuses' &&
          eg.elections.filter(
            e => statusesForFilter[filter].indexOf(e.status) !== -1
          ).length > 0)
    );

    return filteredGroups;
  }

  render() {
    return (
      <ScreenSizeConsumer>
        {({ screenSize }) => {
          const { electionGroups, elections } = this.props;
          const groups = this.filterElectionGroups(
            electionGroups,
            this.state.electionStatusFilter
          );

          let noElectionsText;
          switch (this.state.electionStatusFilter) {
            case 'ongoing':
              noElectionsText = <Trans>general.noOngoingElections</Trans>;
              break;
            case 'announced':
              noElectionsText = <Trans>general.noUpcomingElections</Trans>;
              break;
            case 'closed':
              noElectionsText = <Trans>general.noClosedElections</Trans>;
              break;
          }

          if (['md', 'lg'].indexOf(screenSize) !== -1) {
            return (
              <div>
                <TabSelector>
                  <Tab
                    text={<Trans>electionStatus.ongoingElections</Trans>}
                    onClick={() => this.setElectionStatusFilter('ongoing')}
                    active={this.state.electionStatusFilter === 'ongoing'}
                  />
                  <Tab
                    text={<Trans>electionStatus.upcomingElections</Trans>}
                    onClick={() => this.setElectionStatusFilter('announced')}
                    active={this.state.electionStatusFilter === 'announced'}
                  />
                  <Tab
                    text={<Trans>electionStatus.closedElections</Trans>}
                    onClick={() => this.setElectionStatusFilter('closed')}
                    active={this.state.electionStatusFilter === 'closed'}
                  />
                </TabSelector>
                <VoterElectionsTable
                  electionGroups={groups}
                  noElectionsText={noElectionsText}
                />
              </div>
            );
          }

          let dropdownText;
          switch (this.state.electionStatusFilter) {
            case 'ongoing':
              dropdownText = <Trans>electionStatus.ongoingElections</Trans>;
              break;
            case 'announced':
              dropdownText = <Trans>electionStatus.upcomingElections</Trans>;
              break;
            case 'closed':
              dropdownText = <Trans>electionStatus.closedElections</Trans>;
              break;
          }

          return (
            <div>
              <MobileDropDown
                largeArrow
                text={
                  <Text size="xlarge" bold>
                    {dropdownText}
                  </Text>
                }
              >
                <MobileDropdownItem
                  active={this.state.electionStatusFilter === 'ongoing'}
                  onClick={() => this.setElectionStatusFilter('ongoing')}
                >
                  <Trans>electionStatus.ongoingElections</Trans>
                </MobileDropdownItem>
                <MobileDropdownItem
                  active={this.state.electionStatusFilter === 'announced'}
                  onClick={() => this.setElectionStatusFilter('announced')}
                >
                  <Trans>electionStatus.upcomingElections</Trans>
                </MobileDropdownItem>
                <MobileDropdownItem
                  active={this.state.electionStatusFilter === 'closed'}
                  onClick={() => this.setElectionStatusFilter('closed')}
                >
                  <Trans>electionStatus.closedElections</Trans>
                </MobileDropdownItem>
              </MobileDropDown>
              <VoterElectionsList
                electionGroups={groups}
                noElectionsText={noElectionsText}
              />
            </div>
          );
        }}
      </ScreenSizeConsumer>
    );
  }
}

export default VoterElections;
