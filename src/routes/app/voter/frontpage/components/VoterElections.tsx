import * as React from 'react';
import { Trans } from 'react-i18next';
import { Tabs, Tab } from 'react-bootstrap';
import classNames from 'classnames';

import Text from '../../../../../components/text';
import VoterElectionsList from './VoterElectionsList';
import VoterElectionsTable from './VoterElectionsTable';
import {
  MobileDropDown,
  MobileDropdownItem,
} from '../../../../../components/dropdownMenu';
import { ScreenSizeConsumer } from '../../../../../providers/ScreenSize';
import { ElectionGroup } from '../../../../../interfaces';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

const styles = (theme: any) => ({
  tab: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'none',
    },
    '&:focus': {
      outlineWidth: '0rem',
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
    '&:focus-within': {
      outlineColor: 'rgb(163, 0, 109)',
      outlineWidth: '0.3rem',
      outlineStyle: 'solid',
    },
    background: theme.colors.blueish,
    display: 'inline-flex',
    fontSize: '1.5rem',
  },
});

interface IProps {
  electionGroups: ElectionGroup[];
  canVoteElectionGroups: string[];
  classes: Classes;
}

interface IState {
  electionStatusFilter: string;
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

  filterElectionGroups(electionGroups: ElectionGroup[], filter: string) {
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
    const { classes } = this.props;
    return (
      <ScreenSizeConsumer>
        {({ screenSize }) => {
          const { electionGroups } = this.props;
          const groups = this.filterElectionGroups(
            electionGroups,
            this.state.electionStatusFilter
          );

          let noElectionsText: React.ReactElement;
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
            default:
              noElectionsText = <React.Fragment />;
              break;
          }

          if (['md', 'lg'].indexOf(screenSize) !== -1) {
            return (
              <div>
                <Tabs
                  defaultActiveKey="ongoing"
                  className={classes.tabs}
                  id="elections-tab"
                  onSelect={(key: string) =>
                    this.setState({ electionStatusFilter: key })
                  }
                >
                  <Tab
                    eventKey="ongoing"
                    tabClassName={classNames({
                      [classes.tab]: true,
                      [classes.tabActive]:
                        this.state.electionStatusFilter === 'ongoing',
                    })}
                    title={<Trans>electionStatus.ongoingElections</Trans>}
                  />
                  <Tab
                    eventKey="announced"
                    tabClassName={classNames({
                      [classes.tab]: true,
                      [classes.tabActive]:
                        this.state.electionStatusFilter === 'announced',
                    })}
                    title={<Trans>electionStatus.upcomingElections</Trans>}
                  />
                  <Tab
                    eventKey="closed"
                    tabClassName={classNames({
                      [classes.tab]: true,
                      [classes.tabActive]:
                        this.state.electionStatusFilter === 'closed',
                    })}
                    title={<Trans>electionStatus.closedElections</Trans>}
                  />
                </Tabs>
                <VoterElectionsTable
                  electionGroups={groups}
                  canVoteElectionGroups={this.props.canVoteElectionGroups}
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
            default:
              dropdownText = <React.Fragment />;
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
                canVoteElectionGroups={this.props.canVoteElectionGroups}
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
