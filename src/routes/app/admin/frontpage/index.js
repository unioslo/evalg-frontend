/* @flow */
import * as React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import injectSheet from 'react-jss';

import { objPropsToArray } from 'utils';
import Loading from 'components/loading';
import Page from 'components/page/Page';
import { PageSection } from 'components/page';
import { Trans, translate } from 'react-i18next';
import { ActionButton } from 'components/button';
import ManageElectionsTable from './components/ManageElectionsTable';
import { H3 } from 'components/text';
import { InfoList, InfoListItem } from 'components/infolist';
import Link from 'components/link';

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
      }
    }
  }
`;

const styles = theme => ({
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  helpLinksBox: {
    width: '35rem',
    padding: '2.5rem 3.5rem',
    border: `0.4rem solid`,
    borderRadius: '0.4rem',
    borderColor: theme.helpBoxBorderColor,
    '& .title': {
      fontSize: '2.2rem',
      marginBottom: '1.5rem',
    },
  },
});

const AdminFrontPage = props => {
  const helpLinksBox = (
    <div className={props.classes.helpLinksBox}>
      <p className="title"><Trans>admin.frontPage.helpLinksBoxTitle</Trans></p>
      <InfoList>
        <InfoListItem bulleted>
          <Link
            external
            to="https://www.uio.no/for-ansatte/arbeidsstotte/arrangere-valg/"
          >
            <Trans>admin.frontPage.holdElectionLink</Trans>
          </Link>
        </InfoListItem>
        <InfoListItem bulleted>
          <Link
            external
            to="https://www.uio.no/om/regelverk/orgadm/valgreglement.html"
          >
            <Trans>admin.frontPage.electionRegulationUiOLink</Trans>
          </Link>
        </InfoListItem>
      </InfoList>
    </div>
  );

  return (
    <Query query={electionGroupsQuery}>
      {({ loading, error, data }) => {
        if (loading) {
          return <Loading />;
        }
        if (error) {
          return <p>Error!</p>;
        }
        return (
          <Page header={<Trans>election.manageElections</Trans>}>
            <PageSection noBorder noBtmPadding>
              <div className={props.classes.flexContainer}>
                <Link to="/admin/newElection">
                  <ActionButton
                    text={<Trans>election.createNewElection</Trans>}
                  />
                </Link>
                {helpLinksBox}
              </div>
            </PageSection>
            <PageSection
              noBorder
              header={<Trans>election.manageableElections</Trans>}
            >
              <ManageElectionsTable electionGroups={data.electionGroups} />
            </PageSection>
          </Page>
        );
      }}
    </Query>
  );
};

export default translate()(injectSheet(styles)(AdminFrontPage));
