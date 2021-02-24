import React from 'react';
import { Query, withApollo, WithApolloClient } from 'react-apollo';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';
import { History } from 'history';
import gql from 'graphql-tag';

import Page from 'components/page/Page';
import { PageSection } from 'components/page';
import Text from 'components/text';
import Button, { ButtonContainer } from 'components/button';

import { ISettingsSectionContents } from 'components/page/SettingsSection';
import SettingsSectionsGroup from 'components/page/SettingsSectionsGroup';
import { ElectionGroup } from 'interfaces';

import BaseElectionSettingsSection from './components/BaseElectionSettings';
import VotingPeriodSettingsSection from './components/VotingperiodSettings';
import VoterInfoSettingsSection from './components/VoterInfoSettings';
import AdminRolesSettingsSection from './components/AdminRolesSettings';

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

interface IProps extends WithTranslation {
  electionGroupData: ElectionGroup;
  isNewElection?: boolean;
  handleUpdate?: () => Promise<any>; // TODO: Isn't used. Delete?
  history: History;
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
      this.props.handleUpdate().then(
        () => null,
        (error: string) => console.error(error)
      );
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
    const { electionGroupData } = this.props;
    const { id: groupId, meta } = electionGroupData;

    const { t, i18n, history } = this.props;
    const lang = i18n.language;

    const proceedToCandiates = () => {
      history.push(`/admin/elections/${groupId}/candidates`);
    };

    return (
      <Query query={isCreatingNewElectionQuery}>
        {({
          data: {
            admin: { isCreatingNewElection },
          },
        }: any) => (
          <Page header={t('election.electionInfo')}>
            <PageSection header={<Trans>election.electionType</Trans>}>
              <Text>{electionGroupData.name[lang]}</Text>
            </PageSection>

            <SettingsSectionsGroup
              settingsSectionsContents={this.settingsSectionsContents}
              electionGroupData={electionGroupData}
              startWithDirectedFlowActive={isCreatingNewElection}
              onSettingsWasSaved={this.handleSettingsWasSaved}
            />

            <ButtonContainer alignRight noTopMargin={false}>
              <Button
                text={
                  <span>
                    <Trans>election.goTo</Trans>&nbsp;
                    {meta.candidateType === 'poll' ? (
                      <Trans>admin.pollElec.alternatives</Trans>
                    ) : (
                      <Trans>election.candidates</Trans>
                    )}
                  </span>
                }
                action={proceedToCandiates}
                disabled={
                  electionGroupData.elections.filter((e: any) => e.active)
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

export default withTranslation()(withApollo<IProps>(InfoPage));
