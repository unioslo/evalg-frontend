import * as React from 'react';
import { Trans } from 'react-i18next';
import injectSheet from 'react-jss';

import { PageSection, PageSubSection } from 'components/page';
import Button, { ButtonContainer } from 'components/button';

const styles = (theme: any) => ({
  candidateList: {},
  listItem: {
    alignItems: 'center',
    display: 'flex',
  },
  rank: {
    fontSize: '2.2rem',
  },
});

interface IReviewProps {
  submitAction: () => void;
  selectedCandidate: Candidate;
  isBlankVote: boolean;
  onGoBackToBallot: () => void;
  classes: any;
}

const MajorityVoteReview: React.SFC<IReviewProps> = props => {
  const {
    selectedCandidate,
    isBlankVote,
    onGoBackToBallot,
    submitAction,
  } = props;
  const reviewActions = (
    <ButtonContainer alignLeft={true}>
      <Button
        secondary
        text={<Trans>general.back</Trans>}
        action={onGoBackToBallot}
      />
      <Button
        text={<Trans>election.deliverVote</Trans>}
        action={submitAction}
      />
    </ButtonContainer>
  );
  return (
    <PageSection>
      <Trans>voter.reviewBallot</Trans>
      <PageSubSection header={<Trans>election.ballot</Trans>}>
        {isBlankVote ? (
          <Trans>election.blankVote</Trans>
        ) : (
          <>
            <Trans>voter.chosenCandidate</Trans>: {selectedCandidate.name}
          </>
        )}
        {reviewActions}
      </PageSubSection>
    </PageSection>
  );
};

export default injectSheet(styles)(MajorityVoteReview);
