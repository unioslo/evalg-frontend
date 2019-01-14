/* @flow */
import * as React from 'react';
import { Query, graphql, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Page from 'components/page/Page';
import { PageSection } from 'components/page';
import NewElectionForm from './components/NewElectionForm';
import { Trans } from 'react-i18next';;
import { translate } from 'react-i18next';

type Props = {
  history: RouterHistory,
}

const electionTemplateQuery = gql`
  query {
    electionTemplate
  }
`;

const createNewElectionGroupMutation = gql`
  mutation CreateNewElectionGroup(
      $ouId: UUID!, $template: Boolean!, $templateName: String!) {
    createNewElectionGroup(
        ouId: $ouId, template: $template, templateName: $templateName) {
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

const submit = (mutation: Function) => (values: Object) => {
  mutation({ variables: { ...values } });
}

type State = {
  initialValues: Object
}

class NewElection extends React.Component<any, State> {
  updateValues: Function
  onCreateCompleted: Function
  constructor(props: Props) {
    super(props);
    this.state = { initialValues: {} }
    this.updateValues = this.updateValues.bind(this);
    this.onCreateCompleted = this.onCreateCompleted.bind(this);
  }
  updateValues(newVals: Object) {
    this.setState({ initialValues: newVals });
  }
  onCreateCompleted(data: Object) {
    const { electionGroup } = data.createNewElectionGroup;
    this.props.history.push(`/admin/elections/${electionGroup.id}/info/new`);
  }
  render() {
    return (
      <Query query={electionTemplateQuery}>
        {({ data: { electionTemplate }, loading, error }) => (
          <Mutation
            mutation={createNewElectionGroupMutation}
            onCompleted={this.onCreateCompleted}>
            {createNewElectionGroup => {
              if (loading) {
                return 'Loading...';
              }
              if (error) {
                return 'Error!';
              }
              return (
                <Page header={<Trans>election.electionInfo</Trans>}>
                  <PageSection header={<Trans>election.voterSettings</Trans>}>
                    <NewElectionForm
                      initialValues={this.state.initialValues}
                      updateValues={this.updateValues}
                      electionTemplate={electionTemplate}
                      submitAction={(values) => createNewElectionGroup({ variables: values })}
                      cancelAction={() => this.props.history.goBack}
                    />
                  </PageSection>
                </Page>
              )
            }}
          </Mutation>
        )
        }
      </Query>
    )
  }
}

export default NewElection;
