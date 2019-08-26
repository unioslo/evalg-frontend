import React from 'react';
import { Redirect } from 'react-router';
import { withTranslation, WithTranslation } from 'react-i18next';

import Page from 'components/page/Page';
import Button, { ButtonContainer } from 'components/button';
import { ElectionGroup } from 'interfaces';

import PrefElecCandTable from './components/PrefElecCandTable';
import PrefTeamElecCandTable from './components/PrefTeamElecCandTable';

interface IProps extends WithTranslation {
  electionGroup: ElectionGroup;
}

interface IState {
  proceed: boolean;
}

const determineCandidatePage = (grpType: string, metaData: any) => {
  if (metaData.candidateType === 'single_team') {
    return PrefTeamElecCandTable;
  } else if (metaData.candidateType === 'single') {
    if (grpType === 'multiple_elections') {
      return PrefElecCandTable;
    }
  }
  return PrefTeamElecCandTable;
};

class CandidatesPage extends React.Component<IProps, IState> {
  state = { proceed: false };

  render() {
    const { electionGroup, t } = this.props;
    const { elections, id: groupId } = electionGroup;

    if (elections.length === 0) {
      return <p>No active elections.</p>;
    }
    const { type, meta } = electionGroup;
    const CandidatePage = determineCandidatePage(type, meta);
    return (
      <Page header={t('election.candidates')}>
        <CandidatePage electionGroup={electionGroup} />

        <ButtonContainer alignRight noTopMargin={false}>
          <Button
            text={
              <span>
                {t('election.goTo')}&nbsp;
                {t('election.censuses')}
              </span>
            }
            action={() => this.setState({ proceed: true })}
            iconRight="mainArrow"
          />
        </ButtonContainer>
        {this.state.proceed ? (
          <Redirect push to={`/admin/elections/${groupId}/pollbooks`} />
        ) : null}
      </Page>
    );
  }
}

export default withTranslation()(CandidatesPage);
