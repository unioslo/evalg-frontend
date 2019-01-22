/* @flow */
import * as React from 'react';
import { translate, Trans } from 'react-i18next';

import Page from 'components/page/Page';
import PrefElecCandTable from './components/PrefElecCandTable';
import PrefTeamElecCandTable from './components/PrefTeamElecCandTable';
import Button, { ButtonContainer } from 'components/button';
import { Redirect } from 'react-router';

type Props = {
  children?: React.ChildrenArray<any>,
  electionGroup: ElectionGroup,
};

const determineCandidatePage = (grpType, metaData) => {
  if (metaData.candidateType === 'single_team') {
    return PrefTeamElecCandTable;
  } else if (metaData.candidateType === 'single') {
    if (grpType === 'multiple_elections') {
      return PrefElecCandTable;
    }
  }
  return PrefTeamElecCandTable;
};

class CandidatesPage extends React.Component<Props> {
  state = { proceed: false };

  render() {
    const { electionGroup } = this.props;
    const { elections, id: groupId } = electionGroup;

    if (elections.length === 0) {
      return <p>No active elections.</p>;
    }
    const { type, meta } = electionGroup;
    const CandidatePage = determineCandidatePage(type, meta);
    return (
      <Page header={<Trans>election.candidates</Trans>}>
        <CandidatePage electionGroup={electionGroup} />

        <ButtonContainer alignRight={true} topMargin={true}>
          <Button
            text={
              <span>
                <Trans>election.goTo</Trans>&nbsp;
                <Trans>election.censuses</Trans>
              </span>
            }
            action={() => this.setState({ proceed: true })}
            iconRight="mainArrow"
          />
        </ButtonContainer>
        {this.state.proceed ? (
          <Redirect to={`/admin/elections/${groupId}/pollbooks`} />
        ) : null}
      </Page>
    );
  }
}

export default translate()(CandidatesPage);
