import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';

import { ElectionGroup } from 'interfaces';
import { showGenerateVotesTestingComponent } from 'appConfig';
import Text from 'components/text';
import { PageSection, PageSubSection } from 'components/page';
import { InfoList, InfoListItem } from 'components/infolist';
import ElectionStatus from 'components/electionStatus/ElectionStatus';

import AnnounceElectionGroup from './AnnounceElectionGroup';
import PublishElectionGroup from './PublishElectionGroup';
import LatestElectionGroupCountResult from './LatestElectionGroupCountResult';
import TurnoutSubsection from './TurnoutSubsection';
import GenerateVotesForTesting from './GenerateVotesForTesting';

const PublishElectionGroupMutation = gql`
  mutation PublishElectionGroup($id: UUID!) {
    publishElectionGroup(id: $id) {
      ok
    }
  }
`;

const UnpublishElectionGroupMutation = gql`
  mutation UnpublishElectionGroup($id: UUID!) {
    unpublishElectionGroup(id: $id) {
      ok
    }
  }
`;

const AnnounceElectionGroupMutation = gql`
  mutation AnnounceElectionGroup($id: UUID!) {
    announceElectionGroup(id: $id) {
      ok
    }
  }
`;

const UnannounceElectionGroupMutation = gql`
  mutation UnannounceElectionGroup($id: UUID!) {
    unannounceElectionGroup(id: $id) {
      ok
    }
  }
`;

interface IProps extends WithTranslation {
  electionGroup: ElectionGroup;
}

const blockerToTranslation = {
  'missing-key': 'blockerMissingKey',
  'start-must-be-before-end': 'blockerStartBeforeEnd',
};

class ElectionStatusSection extends React.Component<IProps> {
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
            );
          })}
        </InfoList>
      </PageSubSection>
    );
  }

  renderMultipleStatuses() {
    return (
      <InfoList>
        {this.props.electionGroup.elections.map((election, index) => {
          if (!election.active) {
            return null;
          }
          return (
            <InfoListItem bulleted key={index}>
              <Text inline>
                {election.name[this.props.i18n.language]}
                &nbsp; &nbsp;
                <ElectionStatus status={election.status} />
              </Text>
            </InfoListItem>
          );
        })}
      </InfoList>
    );
  }

  render() {
    const { electionGroup } = this.props;
    const publishable = electionGroup.publicationBlockers.length === 0;
    const { latestElectionGroupCount } = electionGroup;

    return (
      <PageSection header="Status">
        {electionGroup.status !== 'multipleStatuses' ? (
          <Text inline>
            <ElectionStatus textSize="large" status={electionGroup.status} />
          </Text>
        ) : null}

        {electionGroup.status === 'multipleStatuses'
          ? this.renderMultipleStatuses()
          : null}

        <Mutation
          mutation={UnannounceElectionGroupMutation}
          refetchQueries={() => ['electionGroup']}
        >
          {unannounceGroup => (
            <Mutation
              mutation={AnnounceElectionGroupMutation}
              refetchQueries={() => ['electionGroup']}
            >
              {announceGroup => (
                <InfoList>
                  {!electionGroup.published && !publishable ? (
                    <InfoListItem bulleted key="draft-not-ready">
                      <Trans>election.statusDraftNotReady</Trans>
                    </InfoListItem>
                  ) : null}

                  {!electionGroup.published && publishable ? (
                    <InfoListItem bulleted key="draft-ready">
                      <Trans>election.statusDraftReady</Trans>
                    </InfoListItem>
                  ) : null}

                  {!electionGroup.published && !electionGroup.announced ? (
                    <InfoListItem bulleted key="can-announce">
                      <Trans>election.statusCanAnnounce</Trans>
                      &nbsp; &nbsp;
                      <AnnounceElectionGroup
                        electionGroup={electionGroup}
                        announceAction={(id: string) =>
                          announceGroup({ variables: { id } })
                        }
                        unannounceAction={(id: string) =>
                          unannounceGroup({ variables: { id } })
                        }
                      />
                    </InfoListItem>
                  ) : null}

                  {!electionGroup.published && electionGroup.announced ? (
                    <InfoListItem bulleted key="is-announced">
                      <Trans>election.statusIsAnnounced</Trans>
                      &nbsp; &nbsp;
                      <AnnounceElectionGroup
                        electionGroup={electionGroup}
                        announceAction={(id: string) =>
                          announceGroup({ variables: { id } })
                        }
                        unannounceAction={(id: string) =>
                          unannounceGroup({ variables: { id } })
                        }
                      />
                    </InfoListItem>
                  ) : null}

                  {electionGroup.published &&
                  electionGroup.status === 'published' ? (
                    <InfoListItem bulleted key="published-and-ready">
                      <Trans>election.statusOpensAutomatically</Trans>
                    </InfoListItem>
                  ) : null}
                </InfoList>
              )}
            </Mutation>
          )}
        </Mutation>

        {!electionGroup.published && !publishable
          ? this.renderPublicationBlockers()
          : null}

        {electionGroup.published ||
        (!electionGroup.published && publishable) ? (
          <Mutation
            mutation={PublishElectionGroupMutation}
            refetchQueries={() => ['electionGroup']}
          >
            {publishGroup => (
              <Mutation
                mutation={UnpublishElectionGroupMutation}
                refetchQueries={() => ['electionGroup']}
              >
                {unpublishGroup => (
                  <PublishElectionGroup
                    electionGroup={this.props.electionGroup}
                    publishAction={(id: string) =>
                      publishGroup({ variables: { id } })
                    }
                    unpublishAction={(id: string) =>
                      unpublishGroup({ variables: { id } })
                    }
                  />
                )}
              </Mutation>
            )}
          </Mutation>
        ) : null}

        {(electionGroup.status === 'ongoing' ||
          electionGroup.status === 'multipleStatuses' ||
          electionGroup.status === 'closed') && (
          <TurnoutSubsection
            electionGroupId={electionGroup.id}
            doPolling={
              electionGroup.status === 'ongoing' ||
              electionGroup.status === 'multipleStatuses'
            }
          />
        )}

        {showGenerateVotesTestingComponent &&
          (electionGroup.status === 'ongoing' ||
            electionGroup.status === 'multipleStatuses') && (
            <GenerateVotesForTesting electionGroup={electionGroup} />
          )}

        {electionGroup.status === 'closed' && latestElectionGroupCount && (
          <LatestElectionGroupCountResult
            electionGroupCount={latestElectionGroupCount}
          />
        )}
      </PageSection>
    );
  }
}

export default withTranslation()(ElectionStatusSection);
