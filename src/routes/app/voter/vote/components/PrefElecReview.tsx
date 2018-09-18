import * as React from 'react';
import { Trans } from 'react-i18next';

import { PageSection, PageSubSection } from 'components/page';

interface IReviewProps {
  backAction: () => void
  submitAction: () => void
  candidates: Candidate[]
}

const PrefElecReview: React.SFC<IReviewProps> = (props) => {
  return (
    <PageSection>
      <Trans>voter.reviewBallot</Trans>
      <PageSubSection header={<Trans>election.ballot</Trans>}>
        OMGLOL
      </PageSubSection>
    </PageSection>
  )
}

export default PrefElecReview;