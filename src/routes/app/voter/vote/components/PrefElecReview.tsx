import * as React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import injectSheet from 'react-jss';

import { Button, ButtonContainer } from '../../../../../components/button';
import {
  PageSection,
  PageSubSection,
  PageParagraph,
} from '../../../../../components/page';
import {
  CandidateList,
  CandidateListItem,
  CandidateInfo,
} from './CandidateList';

import { Candidate } from '../../../../../interfaces';
import { Classes } from 'jss';

const styles = (theme: any) => ({
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
});

interface IReviewProps extends WithTranslation {
  selectedCandidates: Candidate[];
  isBlankVote: boolean;
  onGoBackToBallot: () => void;
  onSubmitVote: () => void;
  classes: Classes;
}

const PrefElecReview: React.SFC<IReviewProps> = ({
  selectedCandidates,
  isBlankVote,
  onGoBackToBallot,
  onSubmitVote,
  classes,
  t,
}) => {
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
      <Button secondary text={t('general.back')} action={onGoBackToBallot} />
      <Button text={t('voter.submitVote')} action={onSubmitVote} />
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

export default injectSheet(styles)(withTranslation()(PrefElecReview));
