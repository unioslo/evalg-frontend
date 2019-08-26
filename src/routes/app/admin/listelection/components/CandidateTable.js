
import React from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

import Table from 'components/table/Table';
import TableHeader from 'components/table/TableHeader';
import TableHeaderRow from 'components/table/TableHeaderRow';
import TableHeaderCell from 'components/table/TableHeaderCell';
import TableInfoBar from '../../components/TableInfoBar';
import TableEditCell from '../../components/TableEditCell';
import Text from 'components/text';
import TableCandidateInfoUrl from '../../components/CandidateTableInfoUrl';
import TableBody from 'components/table/TableBody';
import TableSearchFilter from '../../../../../components/table/TableSearchFilter';
import TableRow from 'components/table/TableRow';
import TableCell from 'components/table/TableCell';
import Icon from 'components/icon';

import { filterObjPropValue } from 'utils/filterFunctions';
import { Trans } from 'react-i18next';;

// type Props = {
//   candidates: Array<ListElectionCandidate>
// }

// type SortableTableBodyProps = {
//   candidates: Array<ListElectionCandidate>,
//   setNameFilter: Function,
//   setDepartmentFilter: Function
// }

// type SortableCandidateProps = {
//   candidate: ListElectionCandidate
// }

// type SortableCandidateContext = {
//   manager: any,
//   t: Function
// }

// type Indices = {
//   oldIndex: number,
//   newIndex: number
// }

const SortableCandidate = SortableElement(
  (props, ctx) => {
    const candidate = props.candidate;
    return (
      <TableRow>
        <TableCell alignCenter
          noPadding>
          <span className="dragicon">
            <Icon type="forwardArrow" />
          </span>
          {candidate.rank}
        </TableCell>
        <TableCell>
          <Text>
            {candidate.name}
          </Text>
          <TableCandidateInfoUrl url={candidate.infoUrl} />
        </TableCell>
        <TableCell>
          <Text>
            {candidate.department}
          </Text>
        </TableCell>
        <TableCell alignCenter>
          <Text>
            {candidate.accumulated ?
              <Trans>general.yes</Trans> :
              <Trans>general.no</Trans>
            }
          </Text>
        </TableCell>
        <TableEditCell alignRight
          editAction={() => console.error('Editing: ' + candidate.name)} />
      </TableRow>
    )
  }, { withRef: true });

const SortableTableBody = SortableContainer((props) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell />
        <TableCell>
          <TableSearchFilter onChange={props.setNameFilter} />
        </TableCell>
        <TableCell>
          <TableSearchFilter onChange={props.setDepartmentFilter} />
        </TableCell>
        <TableCell />
        <TableCell />
      </TableRow>
      {props.candidates.map((candidate, index) =>
        <SortableCandidate key={`item-${index}`} index={index} candidate={candidate} />
      )}
    </TableBody>
  )
}, { withRef: true });


class CandidateTable extends React.Component {
  // props: Props;
  // context: Context;
  // state: {
  //   nameFilter: string,
  //   departmentFilter: string,
  //   candidates: Array<ListElectionCandidate>
  // };
  constructor(props, context) {
    super(props);
    this.state = {
      nameFilter: '',
      departmentFilter: '',
      candidates: this.sortCandidatesByRank(props.candidates)
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.candidates !== nextProps.candidates) {
      this.setState({
        candidates: this.sortCandidatesByRank(nextProps.candidates)
      });
    }
  }
  onSortEnd(indices) {
    const { oldIndex, newIndex } = indices;
    const newCandidateList = arrayMove(this.state.candidates, oldIndex, newIndex);
    newCandidateList.forEach((candidate, index) => candidate.rank = index + 1);
    this.setState({
      candidates: newCandidateList
    });
  };
  setNameFilter(event) {
    this.setState({ nameFilter: event.target.value })
  }
  setDepartmentFilter(event) {
    this.setState({ departmentFilter: event.target.value })
  }
  filterCandidatesByName(
    candidates
  ) {
    return filterObjPropValue(candidates, 'name', this.state.nameFilter);
  }
  filterCandidatesByDepartment(
    candidates
  ) {
    return filterObjPropValue(candidates, 'department', this.state.departmentFilter);
  }
  filterCandidates(
    candidates
  ) {
    return this.filterCandidatesByName(
      this.filterCandidatesByDepartment(candidates)
    );
  }
  sortCandidatesByRank(
    candidates
  ) {
    return candidates.sort((a, b) => {
      if (a.rank < b.rank) {
        return -1;
      }
      if (a.rank > b.rank) {
        return 1;
      }
      return 0;
    });
  }
  cancelSort(event) {
    if (this.state.nameFilter !== '' || this.state.departmentFilter !== '') {
      return true;
    }
    for (let i = 0; i < event.path.length - 1; i += 1) {
      if (event.path[i].className === 'dragicon') {
        return false;
      }
    }
    return true;
  }
  render() {
    const filteredCandidates = this.filterCandidates(this.state.candidates);
    return (
      <div>
        <TableInfoBar>
          <div>
            {this.context.t('election.candidates')}
            ({this.props.candidates.length})
          </div>
          <div>lawl</div>
        </TableInfoBar>
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Plass</TableHeaderCell>
              <TableHeaderCell>
                {this.context.t('general.candidate')}
              </TableHeaderCell>
              <TableHeaderCell>Studieretning</TableHeaderCell>
              <TableHeaderCell alignCenter>Forhåndskumulering</TableHeaderCell>
              <TableHeaderCell />
            </TableHeaderRow>
          </TableHeader>
          <SortableTableBody
            helperClass="table--row-isdragged"
            shouldCancelStart={this.cancelSort.bind(this)}
            candidates={filteredCandidates}
            onSortEnd={this.onSortEnd.bind(this)}
            setNameFilter={this.setNameFilter.bind(this)}
            setDepartmentFilter={this.setDepartmentFilter.bind(this)}
          />
        </Table>
      </div>
    )
  }
}

export default CandidateTable;
