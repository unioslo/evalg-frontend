import * as React from 'react';
import { Trans } from 'react-i18next';
import { translate } from 'react-i18next';
import { TranslateHocProps } from 'react-i18next/src/translate';
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

interface IReviewProps extends TranslateHocProps {
  selectedCandidates: Candidate[];
  isBlankVote: boolean;
  onGoBackToBallot: () => void;
  onSubmitVote: () => void;
  classes: any;
}

const PrefElecReview: React.SFC<IReviewProps> = ({
  selectedCandidates,
  isBlankVote,
  onGoBackToBallot,
  onSubmitVote,
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
      <Button
        text={<Trans>voter.submitVote</Trans>}
        action={onSubmitVote}
      />
    </ButtonContainer>
  );

  return (
    <PageSection noBorder>
      <div className={classes.ingress}>
        <Trans>voter.reviewBallotIngressText</Trans>
      </div>
      <PageSubSection header={<Trans>election.ballot</Trans>}>
        {isBlankVote ? blankBallot : <PageParagraph>{ballot}</PageParagraph>}
        {reviewButtons}
      </PageSubSection>
    </PageSection>
  );
};

export default injectSheet(styles)(translate()(PrefElecReview));
