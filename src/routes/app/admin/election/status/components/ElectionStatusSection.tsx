import React from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Trans, useTranslation } from 'react-i18next';

import { enableAnnounceElectionGroup } from 'appConfig';
import Spinner from 'components/animations/Spinner';
import { ElectionGroup, IElectionGroupRole } from 'interfaces';
import { showGenerateVotesTestingComponent } from 'appConfig';
import Text from 'components/text';
import { PageSection, PageSubSection } from 'components/page';
import { InfoList, InfoListItem } from 'components/infolist';
import ElectionStatus from 'components/electionStatus/ElectionStatus';
import Link from 'components/link';

import AnnounceElectionGroup from './AnnounceElectionGroup';
import PublishElectionGroup from './PublishElectionGroup';
import LatestElectionGroupCountResult from './LatestElectionGroupCountResult';
import TurnoutSubsection from './TurnoutSubsection';
import GenerateVotesForTesting from './GenerateVotesForTesting';

const PublishElectionGroupMutation = gql`
  mutation PublishElectionGroup($id: UUID!) {
    publishElectionGroup(id: $id) {
      success
    }
  }
`;

const UnpublishElectionGroupMutation = gql`
  mutation UnpublishElectionGroup($id: UUID!) {
    unpublishElectionGroup(id: $id) {
      success
    }
  }
`;

const AnnounceElectionGroupMutation = gql`
  mutation AnnounceElectionGroup($id: UUID!) {
    announceElectionGroup(id: $id) {
      success
    }
  }
`;

const UnannounceElectionGroupMutation = gql`
  mutation UnannounceElectionGroup($id: UUID!) {
    unannounceElectionGroup(id: $id) {
      success
    }
  }
`;

const GET_VIEWER_ROLES = gql`
  query viewer {
    viewer {
      roles {
        ... on ElectionGroupRole {
          groupId
          name
          globalRole
        }
      }
    }
  }
`

const blockerToTranslation = {
  'missing-key': 'blockerMissingKey',
  'start-must-be-before-end': 'blockerStartBeforeEnd',
  'no-active-election': 'blockerNoActiveElection',
};

interface publicationBlockersProps {
  electionGroup: ElectionGroup;
}

const PublicationBlockers: React.FunctionComponent<publicationBlockersProps> = (props: publicationBlockersProps) => {
  const { t } = useTranslation();
  const { publicationBlockers } = props.electionGroup;
  return (
    <PageSubSection header={t('election.statusThisIsMissing')}>
      <InfoList>
        {publicationBlockers.map((blocker, index) => {
          let translation = 'blockerUnknown';
          if (blockerToTranslation.hasOwnProperty(blocker)) {
            translation = blockerToTranslation[blocker];
          }
          return (
            <InfoListItem bulleted key={index}>
              {t(`election.${translation}`)}
            </InfoListItem>
          );
        })}
      </InfoList>
    </PageSubSection>
  );
}


interface multipleStatusesInterface {
  electionGroup: ElectionGroup;
}

const MultipleStatuses: React.FunctionComponent<multipleStatusesInterface> = (props: multipleStatusesInterface) => {
  const { i18n } = useTranslation();
  return (
    <InfoList>
      {props.electionGroup.elections.map((election, index) => {
        if (!election.active) {
          return null;
        }
        return (
          <InfoListItem bulleted key={index}>
            <Text inline>
              {election.name[i18n.language]}
              &nbsp; &nbsp;
                <ElectionStatus status={election.status} />
            </Text>
          </InfoListItem>
        );
      })}
    </InfoList>
  );
}

interface IProps {
  electionGroup: ElectionGroup;
}

/**
 * The election status component
 */
const ElectionStatusSection: React.FunctionComponent<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const { electionGroup } = props;
  const publishable = electionGroup.publicationBlockers.length === 0;
  const { latestElectionGroupCount } = electionGroup;

  return (
    <PageSection header="Status">
      <Query
        query={GET_VIEWER_ROLES}
        fetchPolicy="network-only"
      >
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return (
              <PageSection>
                <Spinner size="2.2rem" darkStyle marginRight="1rem" />
                {t('election.publishLoadingCanPublish')}
              </PageSection>
            )
          }
          let canPublish: boolean = false;
          if (!error && data.viewer.roles !== undefined) {
            const publishRoles: Array<IElectionGroupRole> = data.viewer.roles.filter((x: IElectionGroupRole) => {
              return (x.globalRole && x.name === 'publisher' && x.groupId === null)
            })
            canPublish = publishRoles.length >= 1
          }

          return (
            <>
              {(electionGroup.status !== 'multipleStatuses') ? (
                <Text inline>
                  <ElectionStatus textSize="large" status={electionGroup.status} />
                </Text>
              ) : (
                  <MultipleStatuses electionGroup={electionGroup} />
                )
              }
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
                            {t('election.statusDraftNotReady')}
                          </InfoListItem>
                        ) : null}

                        {!electionGroup.published && publishable ? (
                          <InfoListItem bulleted key="draft-ready">
                            {t('election.statusDraftReady')}
                          </InfoListItem>
                        ) : null}

                        {enableAnnounceElectionGroup && !electionGroup.published && !electionGroup.announced ? (
                          canPublish ? (
                            <InfoListItem bulleted key="can-announce">
                              {t('election.statusCanAnnounce')}
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
                          ) :
                            <InfoListItem bulleted key="can-announced">
                              {t('election.statusCanBeAnnounce')}
                            </InfoListItem>
                        ) : null}
                        {enableAnnounceElectionGroup && !electionGroup.published && electionGroup.announced ? (
                          canPublish ? (
                            <InfoListItem bulleted key="is-announced">
                              {t('election.statusIsAnnounced')}
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
                          ) :
                            <InfoListItem bulleted key="is-announced">
                              {t('election.statusIsAnnounced')}
                            </InfoListItem>
                        ) : null}
                        {electionGroup.published &&
                          electionGroup.status === 'published' ? (
                            <InfoListItem bulleted key="published-and-ready">
                              {t('election.statusOpensAutomatically')}
                            </InfoListItem>
                          ) : null}
                        {!electionGroup.published && !canPublish ? (
                          <InfoListItem bulleted key="cannot-publish">
                            <Trans
                              components={[
                                <Link
                                  key="0"
                                  external
                                  to={'https://www.uio.no/tjenester/it/applikasjoner/e-valg/hjelp/publisering.html'}
                                >
                                  text
                                </Link>
                              ]}
                            >
                              election.publishElectionNotPublisher
                            </Trans>
                          </InfoListItem>
                        ) : null}
                        {electionGroup.published && !canPublish ? (
                          <InfoListItem bulleted key="cannot-unpublish">
                            <Trans
                              components={[
                                <Link
                                  key="0"
                                  external
                                  to={'https://www.uio.no/tjenester/it/applikasjoner/e-valg/hjelp/publisering.html'}
                                >
                                  text
                                </Link>
                              ]}
                            >
                              election.unpublishElectionNotPublisher
                            </Trans>
                          </InfoListItem>
                        ) : null}
                      </InfoList>
                    )}
                  </Mutation>
                )}
              </Mutation>

              {!electionGroup.published && !publishable
                ? <PublicationBlockers electionGroup={electionGroup} />
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
                            electionGroup={electionGroup}
                            publishAction={(id: string) =>
                              publishGroup({ variables: { id } })
                            }
                            unpublishAction={(id: string) =>
                              unpublishGroup({ variables: { id } })
                            }
                            canPublish={canPublish}
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
            </>
          )
        }}
      </Query>
    </PageSection >
  );
}

export default ElectionStatusSection;
