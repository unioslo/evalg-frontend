/* @flow */
import * as React from 'react';
import { translate, Trans } from 'react-i18next';

import { Page } from 'components/page';
import PrefElecCandTable from './components/PrefElecCandTable';
import PrefTeamElecCandTable from './components/PrefTeamElecCandTable';

type Props = {
  children?: React.ChildrenArray<any>,
  electionGroup: ElectionGroup,
};

const determineCandidatePage = (grpType, metaData) => {
  if (metaData.candidateType === 'single_team') {
    return PrefTeamElecCandTable;
  }
  else if (metaData.candidateType === 'single') {
    if (grpType === 'multiple_elections') {
      return PrefElecCandTable;
    }
  }
  return PrefTeamElecCandTable;
};

class CandidatesPage extends React.Component<Props> {
  render() {
    const { electionGroup } = this.props;
    const { elections } = electionGroup;
    if (elections.length === 0) {
      return <p>No active elections.</p>
    }
    const { type, meta } = electionGroup;
    const CandidatePage = determineCandidatePage(type, meta);
    return (
      <Page header={<Trans>election.candidates</Trans>}>
        <CandidatePage electionGroup={electionGroup} />
      </Page>
    )
  }
}

export default translate()(CandidatesPage);
