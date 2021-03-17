import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import { PageSection, PageSubSection } from 'components/page';
import Button, { ButtonContainer } from 'components/button';
import { Candidate } from 'interfaces';

import { CandidateInfo } from './CandidateList';

const useStyles = createUseStyles((theme: any) => ({
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
}));

interface IReviewProps {
  selectedAlternative: Candidate | null;
  isBlankVote: boolean;
  onGoBackToBallot: () => void;
  onSubmitVote: () => void;
  isSubmittingVote: boolean;
  candidatePoll: boolean;
}

const PollVoteReview: React.FunctionComponent<IReviewProps> = props => {
  const {
    selectedAlternative,
    isBlankVote,
    onGoBackToBallot,
    onSubmitVote,
    isSubmittingVote,
    candidatePoll,
  } = props;

  const theme = useTheme();
  const classes = useStyles({ theme });
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
        {!isBlankVote && selectedAlternative && (
          <>
            <p className={classes.chosenCandidateText}>
              {candidatePoll
                ? t('voter.chosenCandidate')
                : t('pollElec.chosenAlternative')}
              :
            </p>
            <div className={classes.chosenCandidateContainer}>
              <CandidateInfo
                key={selectedAlternative.id}
                candidate={selectedAlternative}
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

export default PollVoteReview;
