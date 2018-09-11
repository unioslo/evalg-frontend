/* @flow */
import gql from 'graphql-tag';
import * as React from 'react';
import { Mutation } from 'react-apollo';

import Text from 'components/text';
import { Trans, translate } from 'react-i18next';
import { PageSection, PageSubSection } from 'components/page';
import { InfoList, InfoListItem } from 'components/infolist';
import ElectionStatus from 'components/electionStatus/ElectionStatus';
import AnnounceElectionGroup from './AnnounceElectionGroup';
import PublishElectionGroup from './PublishElectionGroup';

const publishElectionGroup = gql`
  mutation PublishElectionGroup($id: UUID!) {
    publishElectionGroup(id: $id) {
      ok
    }
  }
`;

const unpublishElectionGroup = gql`
  mutation UnpublishElectionGroup($id: UUID!) {
    unpublishElectionGroup(id: $id) {
      ok
    }
  }
`;

type Props = {
  electionGroup: ElectionGroup,
  i18n: Object
};

const blockerToTranslation = {
  'missing-key': 'blockerMissingKey',
  'start-must-be-before-end': 'blockerStartBeforeEnd',
};

class ElectionStatusSection extends React.Component<Props> {
  renderPublicationBlockers() {
    const { publicationBlockers } = this.props.electionGroup;
    return (
      <PageSubSection header={<Trans>election.statusThisIsMissing</Trans>}>
        <InfoList>
          {publicationBlockers.map((blocker, index) => {
            let translation = 'blockerUnknown';
            if (blockerToTranslation.hasOwnProperty(blocker)) {
              translation = blockerToTranslation[blocker];
            }
            return (
              <InfoListItem bulleted key={index}>
                <Trans>{`election.${translation}`}</Trans>
              </InfoListItem>
            )
          })}
        </InfoList>
      </PageSubSection>
    )
  }

  renderMultipleStatuses() {
    return (
      <InfoList>
        {this.props.electionGroup.elections.map((election, index) => {
          if (!election.active) { return null; }
          else {
            return (
              <InfoListItem bulleted key={index}>
                <Text inline>
                  {election.name[this.props.i18n.language]}
                  &nbsp; &nbsp;
                  <ElectionStatus status={election.status} />
                </Text>
              </InfoListItem>
            )
          }
        })}
      </InfoList>)
  }

  render() {
    const { electionGroup } = this.props;
    const publishable = electionGroup.publicationBlockers.length === 0;

    return (
      <PageSection header="Status">
        {electionGroup.status !== 'multipleStatuses' ?
          <Text inline>
            <ElectionStatus textSize="large" status={electionGroup.status} />
          </Text> : null}

        {electionGroup.status === 'multipleStatuses' ?
          this.renderMultipleStatuses() : null}

        <InfoList>
          {!electionGroup.published && !publishable ?
            <InfoListItem bulleted key="draft-not-ready">
              <Trans>election.statusDraftNotReady</Trans>
            </InfoListItem> : null
          }
          {!electionGroup.published && publishable &&
            <InfoListItem bulleted key="draft-ready">
              <Trans>election.statusDraftReady</Trans>
            </InfoListItem>
          }
          {!electionGroup.published && !electionGroup.announced &&
            <InfoListItem bulleted key="can-announce">
              <Trans>election.statusCanAnnounce</Trans>
              &nbsp; &nbsp;
            <AnnounceElectionGroup electionGroup={electionGroup} />
            </InfoListItem>
          }
          {!electionGroup.published && electionGroup.announced &&
            <InfoListItem bulleted key="is-announced">
              <Trans>election.statusIsAnnounced</Trans>
              &nbsp; &nbsp;
            <AnnounceElectionGroup electionGroup={electionGroup} />
            </InfoListItem>
          }
          {electionGroup.published && electionGroup.status === 'published' &&
            <InfoListItem bulleted key="published-and-ready">
              <Trans>election.statusOpensAutomatically</Trans>
            </InfoListItem>
          }
        </InfoList>

        {!electionGroup.published && !publishable ?
          this.renderPublicationBlockers() : null}

        {electionGroup.published ||
          (!electionGroup.published && publishable) ?
          <Mutation
            mutation={publishElectionGroup}
            refetchQueries={() => ['electionGroup']}>
            {(publishGroup) => (
              <Mutation
                mutation={unpublishElectionGroup}
                refetchQueries={() => ['electionGroup']}>
                {(unpublishGroup) => (
                  <PublishElectionGroup
                    electionGroup={this.props.electionGroup}
                    publishAction={(id) =>
                      publishGroup({ variables: { id } })
                    }
                    unpublishAction={(id) =>
                      unpublishGroup({ variables: { id } })
                    }
                  />
                )}
              </Mutation>
            )}
          </Mutation> : null
        }
      </PageSection>
    )
  }
}

export default translate()(ElectionStatusSection);
