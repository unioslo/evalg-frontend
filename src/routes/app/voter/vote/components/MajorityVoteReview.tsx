import React from 'react';
import { useTranslation } from 'react-i18next';
import injectSheet from 'react-jss';

import { PageSection, PageSubSection } from 'components/page';
import Button, { ButtonContainer } from 'components/button';
import { Candidate } from 'interfaces';

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
  selectedCandidates: Candidate[] | null;
  isBlankVote: boolean;
  onGoBackToBallot: () => void;
  onSubmitVote: () => void;
  isSubmittingVote: boolean;
  classes: any;
}

const MajorityVoteReview: React.FunctionComponent<IReviewProps> = props => {
  const {
    selectedCandidates,
    isBlankVote,
    onGoBackToBallot,
    onSubmitVote,
    isSubmittingVote,
    classes,
  } = props;

  const { t } = useTranslation();

  const blankBallot = (
    <div className={classes.blankVoteTextContainer}>
      {t('election.blankVote')}
    </div>
  );

  const reviewButtons = (
    <ButtonContainer alignLeft>
      <Button
        secondary
        text={t('general.back')}
        action={onGoBackToBallot}
        disabled={isSubmittingVote}
      />
      <Button
        text={t('voter.submitVote')}
        action={onSubmitVote}
        disabled={isSubmittingVote}
        showSpinner={isSubmittingVote}
      />
    </ButtonContainer>
  );

  return (
    <PageSection noBorder>
      <div className={classes.ingress}>
        {t('voter.reviewBallotIngressText')}
      </div>
      <PageSubSection header={t('election.ballot')}>
        {isBlankVote && blankBallot}
        {!isBlankVote && selectedCandidates && (
          <>
            <p className={classes.chosenCandidateText}>
              {selectedCandidates.length > 1
                ? t('voter.chosenCandidates')
                : t('voter.chosenCandidate')}
              :
            </p>
            <div className={classes.chosenCandidateContainer}>
              {selectedCandidates.map(candidate => (
                <CandidateInfo
                  key={candidate.id}
                  candidate={candidate}
                  infoUrl
                  noLeftPadding
                />
              ))}
            </div>
          </>
        )}
        {reviewButtons}
      </PageSubSection>
    </PageSection>
  );
};

export default injectSheet(styles)(MajorityVoteReview);
