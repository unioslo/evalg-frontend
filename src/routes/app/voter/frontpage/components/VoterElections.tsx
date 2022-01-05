import React from 'react';
import { Trans } from 'react-i18next';
import { Tabs, Tab } from 'react-bootstrap';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { Classes } from 'jss';
import moment from 'moment';

import Text from 'components/text';
import { MobileDropDown, MobileDropdownItem } from 'components/dropdownMenu';
import { ScreenSizeConsumer } from 'providers/ScreenSize';
import { ElectionGroup } from 'interfaces';

import VoterElectionsList from './VoterElectionsList';
import VoterElectionsTable from './VoterElectionsTable';

const styles = (theme: any) => ({
  tab: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'none',
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '4.4rem',
    width: '15rem',
    color: theme.tabs.textColor,
    background: theme.tabs.backGroundColorInactive,
    borderBottom: `2px solid ${theme.tabs.bottomBorderColorInactive}`,
  },
  tabActive: {
    fontWeight: 'bold',
    background: theme.tabs.backGroundColorActive,
    borderBottomColor: theme.tabs.bottomBorderColorActive,
  },
  tabs: {
    background: theme.colors.blueish,
    display: 'inline-flex',
    fontSize: '1.5rem',
  },
});

interface IProps {
  electionGroups: ElectionGroup[];
  votingRightsElectionGroups: string[];
  classes: Classes;
}

interface IState {
  electionStatusFilter: string | null;
}

class VoterElections extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.setElectionStatusFilter = this.setElectionStatusFilter.bind(this);
    this.filterElectionGroups = this.filterElectionGroups.bind(this);
    this.state = { electionStatusFilter: 'ongoing' };
  }

  setElectionStatusFilter(value: string) {
    this.setState({ electionStatusFilter: value });
  }

  filterElectionGroups(electionGroups: ElectionGroup[], filter: string | null) {
    if (filter === null) {
      return electionGroups;
    }
    const statusesForFilter = {
      ongoing: ['ongoing'],
      announced: ['announced', 'published'],
      closed: ['closed'],
    };

    const filteredGroups = electionGroups.filter(
      (eg) =>
        statusesForFilter[filter].indexOf(eg.status) !== -1 ||
        (eg.status === 'multipleStatuses' &&
          eg.elections.filter(
            (e) => statusesForFilter[filter].indexOf(e.status) !== -1
          ).length > 0)
    );

    const getElectionGroupEndTime = (electionGroup: ElectionGroup) => {
      if (electionGroup.elections.length === 1) {
        return electionGroup.elections[0].end;
      }
      return moment
        .max(...electionGroup.elections.map((e) => moment(e.end)))
        .toISOString();
    };

    const sortedGroups = filteredGroups.sort(
      (a: ElectionGroup, b: ElectionGroup) => {
        const { votingRightsElectionGroups } = this.props;
        const voteA = votingRightsElectionGroups.includes(a.id);
        const voteB = votingRightsElectionGroups.includes(b.id);

        if (voteA === voteB) {
          // Sort on end time if voting right is equal.
          return getElectionGroupEndTime(a).localeCompare(
            getElectionGroupEndTime(b)
          );
        } else if (voteA) {
          return -1;
        }
        return 1;
      }
    );

    return sortedGroups;
  }

  render() {
    const { classes, votingRightsElectionGroups } = this.props;
    const { electionStatusFilter } = this.state;
    return (
      <ScreenSizeConsumer>
        {({ screenSize }) => {
          const { electionGroups } = this.props;
          const groups = this.filterElectionGroups(
            electionGroups,
            electionStatusFilter
          );

          let noElectionsText: React.ReactElement;
          switch (electionStatusFilter) {
            case 'ongoing':
              noElectionsText = <Trans>general.noOngoingElections</Trans>;
              break;
            case 'announced':
              noElectionsText = <Trans>general.noUpcomingElections</Trans>;
              break;
            case 'closed':
              noElectionsText = <Trans>general.noClosedElections</Trans>;
              break;
            default:
              noElectionsText = <></>;
              break;
          }

          if (['md', 'lg'].indexOf(screenSize) !== -1) {
            return (
              <div>
                <Tabs
                  defaultActiveKey="ongoing"
                  className={classes.tabs}
                  id="elections-tab"
                  onSelect={(eventKey: string | null) =>
                    this.setState({ electionStatusFilter: eventKey })
                  }
                >
                  <Tab
                    eventKey="ongoing"
                    tabClassName={classNames({
                      [classes.tab]: true,
                      [classes.tabActive]: electionStatusFilter === 'ongoing',
                    })}
                    title={<Trans>electionStatus.ongoingElections</Trans>}
                  />
                  <Tab
                    eventKey="announced"
                    tabClassName={classNames({
                      [classes.tab]: true,
                      [classes.tabActive]: electionStatusFilter === 'announced',
                    })}
                    title={<Trans>electionStatus.upcomingElections</Trans>}
                  />
                  <Tab
                    eventKey="closed"
                    tabClassName={classNames({
                      [classes.tab]: true,
                      [classes.tabActive]: electionStatusFilter === 'closed',
                    })}
                    title={<Trans>electionStatus.closedElections</Trans>}
                  />
                </Tabs>
                <VoterElectionsTable
                  electionGroups={groups}
                  votingRightsElectionGroups={votingRightsElectionGroups}
                  noElectionsText={noElectionsText}
                />
              </div>
            );
          }

          let dropdownText;
          switch (electionStatusFilter) {
            case 'ongoing':
              dropdownText = <Trans>electionStatus.ongoingElections</Trans>;
              break;
            case 'announced':
              dropdownText = <Trans>electionStatus.upcomingElections</Trans>;
              break;
            case 'closed':
              dropdownText = <Trans>electionStatus.closedElections</Trans>;
              break;
            default:
              dropdownText = <></>;
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
                  active={electionStatusFilter === 'ongoing'}
                  onClick={() => this.setElectionStatusFilter('ongoing')}
                >
                  <Trans>electionStatus.ongoingElections</Trans>
                </MobileDropdownItem>
                <MobileDropdownItem
                  active={electionStatusFilter === 'announced'}
                  onClick={() => this.setElectionStatusFilter('announced')}
                >
                  <Trans>electionStatus.upcomingElections</Trans>
                </MobileDropdownItem>
                <MobileDropdownItem
                  active={electionStatusFilter === 'closed'}
                  onClick={() => this.setElectionStatusFilter('closed')}
                >
                  <Trans>electionStatus.closedElections</Trans>
                </MobileDropdownItem>
              </MobileDropDown>
              <VoterElectionsList
                electionGroups={groups}
                votingRightsElectionGroups={votingRightsElectionGroups}
                noElectionsText={noElectionsText}
              />
            </div>
          );
        }}
      </ScreenSizeConsumer>
    );
  }
}

export default injectSheet(styles)(VoterElections);
