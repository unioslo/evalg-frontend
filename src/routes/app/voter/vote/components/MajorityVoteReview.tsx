import * as React from 'react';
import { Trans } from 'react-i18next';
import injectSheet from 'react-jss';

import { PageSection, PageSubSection } from '../../../../../components/page';
import Button, { ButtonContainer } from '../../../../../components/button';
import { Candidate } from '../../../../../interfaces';
import { CandidateInfo } from './CandidateList';

const styles = (theme: any) => ({
  ingress: {
    ...theme.ingress,
    maxWidth: '63rem',
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
  blankVoteTextContainer: {
    marginTop: '2rem',
    marginBottom: '3rem',
    fontSize: '1.8rem',
  },
});

interface IReviewProps {
  selectedCandidate: Candidate | null;
  isBlankVote: boolean;
  onGoBackToBallot: () => void;
  onSubmitVote: () => void;
  classes: any;
}

const MajorityVoteReview: React.SFC<IReviewProps> = props => {
  const {
    selectedCandidate,
    isBlankVote,
    onGoBackToBallot,
    onSubmitVote,
    classes,
  } = props;

  const blankBallot = (
    <div className={classes.blankVoteTextContainer}>
      <Trans>election.blankVote</Trans>
    </div>
  );

  const reviewButtons = (
    <ButtonContainer alignLeft>
      <Button
        secondary
        text={<Trans>general.back</Trans>}
        action={onGoBackToBallot}
      />
      <Button text={<Trans>voter.submitVote</Trans>} action={onSubmitVote} />
    </ButtonContainer>
  );
  return (
    <PageSection noBorder>
      <div className={classes.ingress}>
        <Trans>voter.reviewBallotIngressText</Trans>
      </div>
      <PageSubSection header={<Trans>election.ballot</Trans>}>
        {isBlankVote ? (
          blankBallot
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
        {reviewButtons}
      </PageSubSection>
    </PageSection>
  );
};

export default injectSheet(styles)(MajorityVoteReview);
