/* @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import Text from 'components/text';
import { Trans, translate } from 'react-i18next';
import { PageSection, PageSubSection } from 'components/page';
import { InfoList, InfoListItem } from 'components/infolist';
import ElectionStatus from 'components/electionStatus/ElectionStatus';
import AnnounceElectionGroup from './AnnounceElectionGroup';
import PublishElectionGroup from './PublishElectionGroup';

type Props = {
  electionGroup: ElectionGroup,
  elections: Array<Election>,
  handleUpdate: Function,
  i18n: Object,
};

const blockerToTranslation = {
  'missing-key': 'blockerMissingKey',
  'start-must-be-before-end': 'blockerStartBeforeEnd',
};

class ElectionStatusSection extends React.Component<Props> {
  renderPublicationBlockers() {
    return (
      <PageSubSection header={ <Trans>election.statusThisIsMissing</Trans> }>
        <InfoList>
          {[].map((blocker, index) => {
            let translation = 'blockerUnknown';
            if (blockerToTranslation.hasOwnProperty(blocker)) {
              translation = blockerToTranslation[blocker];
            }
            return (
              <InfoListItem bulleted key={ index }>
                <Trans>{`election.${translation}`}</Trans>
              </InfoListItem>
            )
          })}
        </InfoList>
      </PageSubSection>)
  }

  renderMultipleStatuses() {
    return (
      <InfoList>
        {this.props.elections.map((election, index) => {
          if (!election.active) { return null; }
          else {
            return (
              <InfoListItem bulleted key={ index }>
                <Text inline>
                  { election.name[this.props.i18n.language] }
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
        {electionGroup.status !== 'multipleStatuses' &&
          <Text inline>
            <ElectionStatus textSize="large" status={electionGroup.status} />
          </Text>}

        {electionGroup.status === 'multipleStatuses' &&
         this.renderMultipleStatuses()}

        <InfoList>
        {!electionGroup.published && !publishable &&
          <InfoListItem bulleted key="draft-not-ready">
            <Trans>election.statusDraftNotReady</Trans>
          </InfoListItem>
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
            <AnnounceElectionGroup electionGroup={ electionGroup } />
          </InfoListItem>
        }
        {!electionGroup.published && electionGroup.announced &&
          <InfoListItem bulleted key="is-announced">
            <Trans>election.statusIsAnnounced</Trans>
            &nbsp; &nbsp;
            <AnnounceElectionGroup electionGroup={ electionGroup } />
          </InfoListItem>
        }
        {electionGroup.published && electionGroup.status === 'published' &&
          <InfoListItem bulleted key="published-and-ready">
            <Trans>election.statusOpensAutomatically</Trans>
          </InfoListItem>
        }
        </InfoList>

        {!electionGroup.published && !publishable &&
          this.renderPublicationBlockers() }

        {!electionGroup.published && publishable &&
          <PublishElectionGroup electionGroup={ this.props.electionGroup } />
        }
        {electionGroup.published &&
          <PublishElectionGroup electionGroup={ this.props.electionGroup } />
        }

      </PageSection>
    )
  }
}

export default ElectionStatusSection;
