import React from 'react';

import { translate, Trans } from 'react-i18next';
import Page from '../../../../../components/page/Page';
import { PageSection } from '../../../../../components/page';
import Text from '../../../../../components/text';
import Button, { ButtonContainer } from '../../../../../components/button';
import { History } from 'history';
import { i18n } from 'i18next';
import gql from 'graphql-tag';

import { ISettingsSectionContents } from '../../../../../components/page/SettingsSection';
import BaseElectionSettingsSection from './components/BaseElectionSettings';
import VotingPeriodSettingsSection from './components/VotingperiodSettings';
import VoterInfoSettingsSection from './components/VoterInfoSettings';
import AdminRolesSettingsSection from './components/AdminRolesSettings';
import SettingsSectionsGroup from '../../../../../components/page/SettingsSectionsGroup';
import { Query, withApollo, WithApolloClient } from 'react-apollo';
import { ElectionGroup } from '../../../../../interfaces';
// import { ElectionGroup } from '../../../../../interfaces';

const isCreatingNewElectionQuery = gql`
  query {
    admin @client {
      isCreatingNewElection
    }
  }
`;

const defaultSettingsSectionsContents: ISettingsSectionContents[] = [
  BaseElectionSettingsSection,
  VotingPeriodSettingsSection,
  VoterInfoSettingsSection,
  AdminRolesSettingsSection,
];

interface IProps {
  electionGroupData: ElectionGroup;
  isNewElection?: boolean;
  handleUpdate?: () => Promise<any>; // TODO: Isn't used. Delete?
  history: History;
  i18n: i18n;
}

type PropsInternal = WithApolloClient<IProps>;

class InfoPage extends React.Component<PropsInternal> {
  private readonly settingsSectionsContents: ISettingsSectionContents[];

  constructor(props: PropsInternal) {
    super(props);

    const isSingleElection =
      this.props.electionGroupData.type === 'single_election';

    if (isSingleElection) {
      this.settingsSectionsContents = defaultSettingsSectionsContents.slice(1);
    } else {
      this.settingsSectionsContents = defaultSettingsSectionsContents.slice();
    }
  }

  handleSettingsWasSaved = () => {
    if (this.props.handleUpdate) {
      this.props
        .handleUpdate()
        .then(() => null, (error: string) => console.error(error));
    }
  };

  componentWillUnmount() {
    const localStateData = {
      // TODO: find out how to not need __typename here
      admin: { isCreatingNewElection: false, __typename: 'admin' },
    };
    this.props.client.writeData({ data: localStateData });
  }

  render() {
    const { id: groupId } = this.props.electionGroupData;

    const lang = this.props.i18n.language;
    const history = this.props.history;

    const proceedToCandiates = () => {
      history.push(`/admin/elections/${groupId}/candidates`);
    };

    return (
      <Query query={isCreatingNewElectionQuery}>
        {({
          data: {
            admin: { isCreatingNewElection },
          },
        }) => (
          <Page header={<Trans>election.electionInfo</Trans>}>
            <PageSection header={<Trans>election.electionType</Trans>}>
              <Text>{this.props.electionGroupData.name[lang]}</Text>
            </PageSection>

            <SettingsSectionsGroup
              settingsSectionsContents={this.settingsSectionsContents}
              electionGroupData={this.props.electionGroupData}
              startWithDirectedFlowActive={isCreatingNewElection}
              onSettingsWasSaved={this.handleSettingsWasSaved}
            />

            <ButtonContainer alignRight={true} noTopMargin={false}>
              <Button
                text={
                  <span>
                    <Trans>election.goTo</Trans>&nbsp;
                    <Trans>election.candidates</Trans>
                  </span>
                }
                action={proceedToCandiates}
                disabled={
                  this.props.electionGroupData.elections.filter((e: any) => e.active)
                    .length === 0
                }
                iconRight="mainArrow"
              />
            </ButtonContainer>
          </Page>
        )}
      </Query>
    );
  }
}

export default translate()(withApollo(InfoPage));
