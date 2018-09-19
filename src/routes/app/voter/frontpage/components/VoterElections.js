
import * as React from 'react';
import { Trans } from 'react-i18next';;

import Text from 'components/text';
import VoterElectionsList from './VoterElectionsList';
import VoterElectionsTable from './VoterElectionsTable';
import { MobileDropDown, MobileDropdownItem } from 'components/dropdownMenu';
import { TabSelector, Tab } from "./TabSelector";
import { ScreenSizeConsumer } from 'providers/ScreenSize';

type Props = {
  electionGroups: Array<ElectionGroup>,
}

type State = {
  electionStatusFilter: string
}

class VoterElections extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { electionStatusFilter: 'ongoing' };
  }

  setElectionStatusFilter(value) {
    this.setState({ electionStatusFilter: value })
  }

  render() {
    return (
      <ScreenSizeConsumer>
        {({ screenSize }) => {
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

          if (['md', 'lg'].indexOf(screenSize) !== -1) {
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
        }}
      </ScreenSizeConsumer>
    )
  }
}

export default VoterElections;