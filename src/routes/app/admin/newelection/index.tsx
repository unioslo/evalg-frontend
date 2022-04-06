import React from 'react';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { Query, Mutation } from '@apollo/client/react/components';
import { History } from 'history';

import Page from 'components/page/Page';
import { PageSection } from 'components/page';
import { isCreatingNewElectionVar } from 'cache';

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

  public onCreateCompleted(data: any) {
    const { history } = this.props;

    // Update the local apollo state
    isCreatingNewElectionVar(true);

    const { electionGroup } = data.createNewElectionGroup;
    history.push(`/admin/elections/${electionGroup.id}/info`);
  }

  public updateValues(newVals: any) {
    this.setState({ currentValues: { ...newVals } });
  }

  public render() {
    const { history, t } = this.props;
    const { currentValues } = this.state;
    return (
      <Query query={electionTemplateQuery}>
        {(result: any) => {
          const { data, loading, error } = result;
          return (
            <Mutation
              mutation={createNewElectionGroupMutation}
              onCompleted={(newElectionData: any) =>
                this.onCreateCompleted(newElectionData)
              }
            >
              {(createNewElectionGroup: any) => {
                if (loading) {
                  return <div>Loading...</div>;
                }
                if (error) {
                  return <div>Error!</div>;
                }
                return (
                  <Page header={t('election.createNewElection')}>
                    <PageSection header={<Trans>election.selectType</Trans>}>
                      <NewElectionForm
                        initialValues={currentValues}
                        updateValues={this.updateValues}
                        electionTemplate={data.electionTemplate}
                        submitAction={(values: any) =>
                          createNewElectionGroup({ variables: values })
                        }
                        cancelAction={() => history.push('/admin')}
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
