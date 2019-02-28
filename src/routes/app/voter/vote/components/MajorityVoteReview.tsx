import * as React from 'react';
import { Trans } from 'react-i18next';
import injectSheet from 'react-jss';

import { PageSection, PageSubSection } from 'components/page';
import Button, { ButtonContainer } from 'components/button';
import { CandidateInfo } from './CandidateList';

const styles = (theme: any) => ({
  ingress: {
    ...theme.ingress,
  },
  chosenCandidateText: {
    marginTop: '2rem',
    fontStyle: 'italic',
  },
  chosenCandidateContainer: {
    marginTop: '1.5rem',
    marginBottom: '3rem',
    border: '1px solid #CCC',
    padding: '1rem 1.5rem',
  },
  blanVoteTextContainer: {
    marginTop: '2rem',
    marginBottom: '3rem',
    fontSize: '1.8rem',
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
    classes,
  } = props;
  const reviewActions = (
    <ButtonContainer alignLeft>
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
      <div className={classes.ingress}>
        <Trans>voter.reviewBallot</Trans>
      </div>
      <PageSubSection header={<Trans>election.ballot</Trans>}>
        {isBlankVote ? (
          <div className={classes.blanVoteTextContainer}>
            <Trans>election.blankVote</Trans>
          </div>
        ) : (
          <>
            <p className={classes.chosenCandidateText}>
              <Trans>voter.chosenCandidate</Trans>:
            </p>
            <div className={classes.chosenCandidateContainer}>
              <CandidateInfo
                candidate={selectedCandidate}
                infoUrl
                noLeftPadding
              />
            </div>
          </>
        )}
        {reviewActions}
      </PageSubSection>
    </PageSection>
  );
};

export default injectSheet(styles)(MajorityVoteReview);
