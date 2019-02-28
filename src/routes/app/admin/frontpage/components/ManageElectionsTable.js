/* @flow */
import * as React from 'react';

import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from 'components/table';

import Icon from 'components/icon';
import ElectionGroupTableRow from './ElectionGroupTableRow';
import ElectionTableRow from './ElectionTableRow';
import Link from 'components/link';
import { Trans } from 'react-i18next';

// import { objPropsToArray } from 'utils';
import injectSheet from 'react-jss';

const styles = theme => ({
  votesOutsideCensusColumnHeader: {
    width: '8rem',
  },
});

// type Props = {
//   electionGroups: Object,
// };

// type State = {
//   selectedElection: string,
// };

class ManageElectionsTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = { selectedElection: '' };
    this.setSelected = this.setSelected.bind(this);
  }

  setSelected(electionId) {
    if (electionId === this.state.selectedElection) {
      this.setState({ selectedElection: '' });
    } else {
      this.setState({ selectedElection: electionId });
    }
  }
  render() {
    const { electionGroups, classes } = this.props;
    if (electionGroups.length === 0) {
      return (
        <div>
          <h2 className="content--header">
            <Trans>election.manageableElections</Trans>
          </h2>
          <p>
            <Trans>election.noManageableElections</Trans>
          </p>
        </div>
      );
    }
    return (
      <Table>
        <TableHeader key="thead">
          <TableHeaderRow>
            <TableHeaderCell />
            <TableHeaderCell>
              <Trans>election.elections</Trans>
            </TableHeaderCell>
            <TableHeaderCell>
              <Trans>election.opens</Trans>
            </TableHeaderCell>
            <TableHeaderCell>
              <Trans>election.closes</Trans>
            </TableHeaderCell>
            <TableHeaderCell>
              <div className={classes.votesOutsideCensusColumnHeader}>
                <Trans>election.votesOutsideCensus</Trans>
              </div>
            </TableHeaderCell>
            <TableHeaderCell>
              <Trans>election.electionStatus</Trans>
            </TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        {electionGroups.map((elGrp, index) => {
          let selected = false;
          if (this.state.selectedElection === elGrp.id) {
            selected = true;
          }
          return (
            <TableBody key={index}>
              <ElectionGroupTableRow
                elGrp={elGrp}
                selectAction={this.setSelected.bind(this)}
                selected={selected}
              />
              {selected &&
                elGrp.type === 'multiple_elections' &&
                elGrp.elections.map(el => {
                  if (!el.active) {
                    return null;
                  }
                  return <ElectionTableRow key={el.id} election={el} />;
                })}
              {selected && (
                <TableRow thickBorder noHoverBg>
                  <TableCell />
                  <TableCell colspan="5" greyBg alignRight>
                    <Link
                      to={`/admin/elections/${elGrp.id}/status`}
                      marginRight
                    >
                      <Icon type="forwardArrow" marginRight />
                      <Trans>election.goTo</Trans>&nbsp;
                      <Trans>election.status</Trans>
                    </Link>
                    <Link to={`/admin/elections/${elGrp.id}/info`}>
                      <Icon type="forwardArrow" marginRight />
                      <Trans>election.goTo</Trans>&nbsp;
                      <Trans>election.settings</Trans>
                    </Link>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          );
        })}
      </Table>
    );
  }
}

export default injectSheet(styles)(ManageElectionsTable);
