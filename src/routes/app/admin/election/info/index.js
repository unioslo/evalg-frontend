/* @flow */
import * as React from 'react';

import { translate, Trans } from 'react-i18next';
import Page from 'components/page/Page';
import { PageSection } from 'components/page';
import Text from 'components/text';
import BaseElectionSettingsSection from './components/BaseElectionSettingsSection';
import VotingPeriodSection from './components/VotingPeriodSection';
import VoterInfoSection from './components/VoterInfoSection';
import AdminRolesSection from './components/AdminRolesSection';
import Button, { ButtonContainer } from 'components/button';

type Props = {
  children?: ReactChildren,
  groupId: string,
  electionGroup: Object,
  handleUpdate: Function,
  history: RouterHistory,
  i18n: Object
};

const activeSectionOptions = {
  none: 'none',
  baseGroupSettings: 'baseGroupSettings',
  baseElectionSettings: 'baseElectionSettings',
  votingPeriod: 'votingPeriod',
  voterInfo: 'voterInfo',
  adminRoles: 'adminRoles'
};

type Section = $Keys<typeof activeSectionOptions>;

type State = {
  activeSection: Section
}

class InfoPage extends React.Component<Props, State> {
  handleUpdate: Function;

  constructor(props: Props) {
    super(props);
    this.state = { activeSection: 'none' };
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate(payload: Object) {
    return this.props.handleUpdate(payload).then(
      () => null,
      (error) => console.error(error)
    )
  }

  setActive(section: Section) {
    this.setState({ activeSection: section });
  }

  render() {
    const {
      electionGroup, electionGroup: { id }, history
    } = this.props;
    const { elections } = electionGroup;
    const lang = this.props.i18n.language;

    const { activeSection } = this.state;
    const activeElections = elections.filter(e => e.active);
    return (
      <Page header={<Trans>election.electionInfo</Trans>}>

        <PageSection header={<Trans>election.electionType</Trans>} >
          <Text>{electionGroup.name[lang]}</Text>
        </PageSection>

        {electionGroup.type === 'multiple_elections' &&
          <BaseElectionSettingsSection
            setActive={this.setActive.bind(this, 'baseElectionSettings')}
            active={activeSection === 'baseElectionSettings'}
            submitAction={this.handleUpdate}
            closeAction={this.setActive.bind(this, 'none')}
            electionGroup={electionGroup}
            elections={elections}
          />
        }
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

        <ButtonContainer alignRight topMargin>
          <Button
            text={<span>
              <Trans>election.goTo</Trans>&nbsp;
                    <Trans>election.candidates</Trans>
            </span>}
            action={() => history.push(`/admin/elections/${id}/candidates`)}
            disabled={elections.filter(e => e.active).length === 0}
            iconRight="mainArrow"
          />
        </ButtonContainer>
      </Page>
    )
  }
}

export default translate()(InfoPage);