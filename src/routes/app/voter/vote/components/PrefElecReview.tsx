import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import { Button, ButtonContainer } from 'components/button';
import { PageSection, PageSubSection, PageParagraph } from 'components/page';
import { Candidate } from 'interfaces';

import {
  CandidateList,
  CandidateListItem,
  CandidateInfo,
} from './CandidateList';

const useStyles = createUseStyles((theme: any) => ({
  ingress: {
    ...theme.ingress,
    maxWidth: '63rem',
  },
  rank: {
    fontSize: '2.4rem',
    paddingRight: '1rem',
  },
  blankVoteTextContainer: {
    marginTop: '2rem',
    marginBottom: '3rem',
    fontSize: '1.8rem',
  },
}));

interface IReviewProps {
  selectedCandidates: Candidate[];
  isBlankVote: boolean;
  onGoBackToBallot: () => void;
  onSubmitVote: () => void;
  isSubmittingVote: boolean;
}

const PrefElecReview: React.SFC<IReviewProps> = ({
  selectedCandidates,
  isBlankVote,
  onGoBackToBallot,
  onSubmitVote,
  isSubmittingVote,
}) => {

  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });  

  const ballot = (
    <CandidateList>
      {selectedCandidates.map((candidate, index) => {
        const rankNr = index + 1;
        return (
          <CandidateListItem key={index}>
            <div className={classes.rank}>{rankNr}</div>
            <CandidateInfo candidate={candidate} infoUrl />
          </CandidateListItem>
        );
      })}
    </CandidateList>
  );

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
        {isBlankVote ? blankBallot : <PageParagraph>{ballot}</PageParagraph>}
        {reviewButtons}
      </PageSubSection>
    </PageSection>
  );
};

export default PrefElecReview;
