import * as React from 'react';

import Text from 'components/text';
import { Trans } from 'react-i18next';
import { PageSection } from 'components/page';


class ElectionGroupVotes extends React.Component {
  render() {
    return (
      <PageSection header={<Trans>election.votes</Trans>}>
        <Text>
          <Trans>election.electionNotStarted</Trans>
        </Text>
      </PageSection>
    )
  }
}

export default ElectionGroupVotes;