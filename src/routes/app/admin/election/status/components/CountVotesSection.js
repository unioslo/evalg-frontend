import * as React from 'react';

import Text from 'components/text';
import { PageSection } from 'components/page';


class CountVotesSection extends React.Component {
  render() {
    return (
      <PageSection header="Opptelling">
        <Text>Her telles det.</Text>
      </PageSection>
    )
  }
}

export default CountVotesSection;