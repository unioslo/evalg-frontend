import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import { Trans, translate } from 'react-i18next';

import { Page, PageSection } from 'components/page';
import VoterElections from './components/VoterElections';

const electionGroupsQuery = gql`
  query {
    electionGroups {
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
        electionGroup {
          id
        }
      }
    }
  }
`;

const VoterFrontPage: React.SFC = () => (
  <Query query={electionGroupsQuery}>
    {({ data, loading, error }) => {
      if (loading || error) {
        return null;
      }
      return (
        <Page header={<Trans>general.welcome</Trans>}>
          <PageSection desc={<Trans>general.frontPageDesc</Trans>}>
            <VoterElections electionGroups={data.electionGroups} />
          </PageSection>
        </Page>
      );
    }}
  </Query>
);

export default translate()(VoterFrontPage);
