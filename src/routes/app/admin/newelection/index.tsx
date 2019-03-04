/* @flow */
import * as React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Page from '../../../../components/page/Page';
import { PageSection } from '../../../../components/page';
import NewElectionForm from './components/NewElectionForm';
import { Trans } from 'react-i18next';
import { ApolloClient } from 'apollo-client';
import { History } from 'history';
import { EvalgClientState } from '../../../../interfaces';

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
  ) {
    createNewElectionGroup(
      ouId: $ouId
      template: $template
      templateName: $templateName
    ) {
      electionGroup {
        id
        name
        description
        type
        candidateType
        mandateType
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
          type
          candidateType
          mandateType
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

interface IProps {
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

  public updateValues(newVals: any) {
    this.setState({ currentValues: newVals });
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

  // tslint:disable:jsx-no-lambda
  public render() {
    return (
      <Query query={electionTemplateQuery}>
        {({ data: { electionTemplate }, loading, error, client }) => (
          <Mutation
            mutation={createNewElectionGroupMutation}
            onCompleted={data => this.onCreateCompleted(data, client)}
          >
            {createNewElectionGroup => {
              if (loading) {
                return 'Loading...';
              }
              if (error) {
                return 'Error!';
              }
              return (
                <Page header={<Trans>election.createNewElection</Trans>}>
                  <PageSection header={<Trans>election.selectType</Trans>}>
                    <NewElectionForm
                      initialValues={this.state.currentValues}
                      updateValues={this.updateValues}
                      electionTemplate={electionTemplate}
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
        )}
      </Query>
    );
  }
}

export default NewElection;
