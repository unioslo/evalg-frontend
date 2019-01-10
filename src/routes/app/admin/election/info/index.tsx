import React from 'react';

import { translate, Trans } from 'react-i18next';
import Page from 'components/page/Page';
import { PageSection } from 'components/page';
import Text from 'components/text';
import BaseElectionSettingsSection from './components/BaseElectionSettingsSection';
import VotingPeriodSection from './components/VotingPeriodSection';
import VoterInfoSection from './components/VoterInfoSection';
import AdminRolesSection from './components/AdminRolesSection';
import Button, { ButtonContainer } from 'components/button';
import { History } from 'history';
import { i18n } from 'i18next';

interface IProps {
  children?: React.ReactChildren;
  groupId: string;
  electionGroup: ElectionGroup;
  handleUpdate: (payload: any) => any;
  history: History;
  i18n: i18n;
}

interface IState {
  activeSection: activeSectionName;
}

type activeSectionName =
  | 'none'
  | 'baseGroupSettings'
  | 'baseElectionSettings'
  | 'votingPeriod'
  | 'voterInfo'
  | 'adminRoles';

class InfoPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { activeSection: 'none' };
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  public handleUpdate(payload: any) {
    return this.props
      .handleUpdate(payload)
      .then(() => null, (error: string) => console.error(error));
  }

  public setActive(section: activeSectionName) {
    this.setState({ activeSection: section });
  }

  public render() {
    const {
      electionGroup,
      history,
    } = this.props;
    const { elections, id: groupId } = electionGroup;
    const lang = this.props.i18n.language;

    const { activeSection } = this.state;
    const activeElections = elections.filter(e => e.active);

    const proceedToCandiates = () => {
      history.push(`/admin/elections/${groupId}/candidates`)
    }

    return (
      <Page header={<Trans>election.electionInfo</Trans>}>
        <PageSection header={<Trans>election.electionType</Trans>}>
          <Text>{electionGroup.name[lang]}</Text>
        </PageSection>

        {electionGroup.type === 'multiple_elections' && (
          <BaseElectionSettingsSection
            setActive={this.setActive.bind(this, 'baseElectionSettings')}
            active={activeSection === 'baseElectionSettings'}
            submitAction={this.handleUpdate}
            closeAction={this.setActive.bind(this, 'none')}
            electionGroup={electionGroup}
            elections={elections}
          />
        )}
        <VotingPeriodSection
          setActive={this.setActive.bind(this, 'votingPeriod')}
          active={activeSection === 'votingPeriod'}
          submitAction={this.handleUpdate}
          closeAction={this.setActive.bind(this, 'none')}
          electionGroup={electionGroup}
          elections={activeElections}
        />

        <VoterInfoSection
          setActive={this.setActive.bind(this, 'voterInfo')}
          active={activeSection === 'voterInfo'}
          submitAction={this.handleUpdate}
          closeAction={this.setActive.bind(this, 'none')}
          electionGroup={electionGroup}
          elections={activeElections}
        />
        <AdminRolesSection
          setActive={this.setActive.bind(this, 'adminRoles')}
          active={activeSection === 'adminRoles'}
          electionGroup={electionGroup}
          closeAction={this.setActive.bind(this, 'none')}
        />

        <ButtonContainer alignRight={true} topMargin={true}>
          <Button
            text={
              <span>
                <Trans>election.goTo</Trans>&nbsp;
                <Trans>election.candidates</Trans>
              </span>
            }
            action={proceedToCandiates}
            disabled={elections.filter(e => e.active).length === 0}
            iconRight="mainArrow"
          />
        </ButtonContainer>
      </Page>
    );
  }
}

export default translate()(InfoPage);
