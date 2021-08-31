import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import { ApolloClient } from 'apollo-client';
import { History } from 'history';

import Page from 'components/page/Page';
import { PageSection } from 'components/page';
import { EvalgClientState } from 'interfaces';

import NewElectionForm from './components/NewElectionForm';

const electionTemplateQuery = gql`
  query {
    electionTemplate
  }
`;

const createNewElectionGroupMutation = gql`
  mutation CreateNewElectionGroup(
    $ouId: UUID!
    $template: Boolean!
    $templateName: String!
    $name: ElectionName
  ) {
    createNewElectionGroup(
      ouId: $ouId
      template: $template
      templateName: $templateName
      nameDict: $name
    ) {
      electionGroup {
        id
        name
        description
        type
        meta
        ouId
        publicKey
        announcedAt
        publishedAt
        cancelledAt
        deletedAt
        status
        cancelled
        announced
        published
        deleted
        elections {
          id
          name
          description
          meta
          sequence
          start
          end
          informationUrl
          contact
          mandatePeriodStart
          mandatePeriodEnd
          groupId
          active
          status
          publishedAt
          cancelledAt
        }
      }
    }
  }
`;

interface IProps extends WithTranslation {
  history: History;
}

interface IState {
  currentValues: any;
}

class NewElection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { currentValues: {} };
    this.updateValues = this.updateValues.bind(this);
    this.onCreateCompleted = this.onCreateCompleted.bind(this);
  }

  public onCreateCompleted(data: any, client: ApolloClient<EvalgClientState>) {
    const localStateData = {
      // TODO: find out how to not need __typename here
      admin: { isCreatingNewElection: true, __typename: 'admin' },
    };
    client.writeData({ data: localStateData });

    const { electionGroup } = data.createNewElectionGroup;
    this.props.history.push(`/admin/elections/${electionGroup.id}/info`);
  }

  public updateValues(newVals: any) {
    this.setState({ currentValues: { ...newVals } });
  }

  // tslint:disable:jsx-no-lambda
  public render() {
    return (
      <Query query={electionTemplateQuery}>
        {(result: any) => {
          const { data, loading, error, client } = result;
          return (
            <Mutation
              mutation={createNewElectionGroupMutation}
              onCompleted={(data: any) => this.onCreateCompleted(data, client)}
            >
              {(createNewElectionGroup: any) => {
                if (loading) {
                  return <div>Loading...</div>;
                }
                if (error) {
                  return <div>Error!</div>;
                }
                return (
                  <Page header={this.props.t('election.createNewElection')}>
                    <PageSection header={<Trans>election.selectType</Trans>}>
                      <NewElectionForm
                        initialValues={this.state.currentValues}
                        updateValues={this.updateValues}
                        electionTemplate={data.electionTemplate}
                        submitAction={(values: any) =>
                          createNewElectionGroup({ variables: values })
                        }
                        cancelAction={() => this.props.history.push('/admin')}
                      />
                    </PageSection>
                  </Page>
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default withTranslation()(NewElection);
