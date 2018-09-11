/* @flow */
import gql from 'graphql-tag';
import * as React from 'react';
import { Mutation } from 'react-apollo';

import Text from 'components/text';
import Link from 'components/link';
import { Trans } from 'react-i18next';
import { InfoList, InfoListItem } from 'components/infolist';
import { PageSection } from 'components/page';
import CreateElectionKey from './CreateElectionKey';

const createElectionKey = gql`
  mutation CreateElectionGroupKey($id: UUID!, $key: String!) {
    createElectionGroupKey(id: $id, key: $key) {
      ok
    }
  }
`;

type Props = {
  electionGroup: ElectionGroup,
};

class ElectionKeySection extends React.Component<Props> {
  render() {
    const { electionGroup } = this.props;
    const hasKey = electionGroup.publicKey !== null;

    return (
      <PageSection header={<Trans>election.electionKey</Trans>}>
        {!hasKey &&
          <div>
            <Text>
              <Trans>election.electionKeyMissing</Trans>
            </Text>
            <Mutation
              mutation={createElectionKey}
              refetchQueries={() => ['electionGroup']}>
              {(createKey) => (
                <CreateElectionKey
                  electionGroup={electionGroup}
                  createAction={(id, key) =>
                    createKey({ variables: { id, key } }
                    )}
                />
              )}
            </Mutation>
          </div>}
        {hasKey &&
          <div>
            <Text>
              <Trans>election.electionKeyExists</Trans>
            </Text>
            <InfoList>
              <InfoListItem bulleted key="keep-it-safe">
                <Trans>election.electionKeyStatusKeepItSafe</Trans>
              </InfoListItem>
              <InfoListItem bulleted key="can-replace">
                <Trans>election.electionKeyStatusCanReplace</Trans>
              </InfoListItem>
              <InfoListItem bulleted key="read-more">
                <Link external to="#TODO">
                  <Trans>election.electionKeyReadMore</Trans>
                </Link>
              </InfoListItem>
            </InfoList>
          </div>
        }
      </PageSection>
    )
  }
}

export default ElectionKeySection;
