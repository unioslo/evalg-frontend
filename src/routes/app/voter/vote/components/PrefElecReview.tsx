import * as React from 'react';
import { Trans } from 'react-i18next';
import { translate } from 'react-i18next';
import { TranslateHocProps } from 'react-i18next/src/translate';
import injectSheet from 'react-jss';
import { Button, ButtonContainer } from 'components/button';
import { PageSection, PageSubSection, PageParagraph } from 'components/page';
import {
  CandidateList,
  CandidateListItem,
  CandidateInfo,
} from './CandidateList';

const styles = (theme: any) => ({
  ingress: {
    ...theme.ingress,
  },
  rank: {
    fontSize: '2.4rem',
    paddingRight: '1rem',
  },
  blanVoteTextContainer: {
    marginTop: '2rem',
    marginBottom: '3rem',
    fontSize: '1.8rem',
  },
});

interface IReviewProps extends TranslateHocProps {
  selectedCandidates: Candidate[];
  isBlankVote: boolean;
  onGoBackToBallot: () => void;
  onSubmitBallot: () => void;
  classes: any;
}

const PrefElecReview: React.SFC<IReviewProps> = ({
  selectedCandidates,
  isBlankVote,
  onGoBackToBallot,
  onSubmitBallot,
  classes,
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
    <div className={classes.blanVoteTextContainer}>
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
      <Button
        text={<Trans>election.deliverVote</Trans>}
        action={onSubmitBallot}
      />
    </ButtonContainer>
  );

  return (
    <PageSection>
      <div className={classes.ingress}>
        <Trans>voter.reviewBallot</Trans>
      </div>
      <PageSubSection header={<Trans>election.ballot</Trans>}>
        {isBlankVote ? blankBallot : <PageParagraph>{ballot}</PageParagraph>}
        {reviewButtons}
      </PageSubSection>
    </PageSection>
  );
};

export default injectSheet(styles)(translate()(PrefElecReview));
