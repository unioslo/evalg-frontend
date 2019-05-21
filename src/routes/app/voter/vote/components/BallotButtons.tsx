import React from 'react';
import { Trans } from 'react-i18next';

import { ScreenSizeConsumer } from 'providers/ScreenSize';
import Button, { ButtonContainer } from 'components/button';

interface IProps {
  onGoBackToSelectVoterGroup: () => void;
  onBlankVote: () => void;
  onReviewBallot: () => void;
  reviewBallotEnabled: boolean;
}

const BallotButtons: React.SFC<IProps> = ({
  onGoBackToSelectVoterGroup,
  onBlankVote,
  reviewBallotEnabled,
  onReviewBallot,
}) => {
  const backButton = (
    <Button
      text={<Trans>general.back</Trans>}
      action={onGoBackToSelectVoterGroup}
      secondary
    />
  );
  const blankVoteButtonForScreenSize = (screenSize: string) => (
    <Button
      text={<Trans>election.blankVote</Trans>}
      action={onBlankVote}
      secondary
      fillWidth={screenSize === 'mobile'}
      centerContent={screenSize === 'mobile'}
    />
  );
  const reviewBallotButtonForScreenSize = (screenSize: string) => (
    <Button
      text={
        screenSize === 'mobile' || screenSize === 'sm' ? (
          <Trans>voter.reviewBallotMobile</Trans>
        ) : (
          <Trans>voter.reviewBallot</Trans>
        )
      }
      disabled={!reviewBallotEnabled}
      action={onReviewBallot}
    />
  );

  return (
    <ScreenSizeConsumer>
      {({ screenSize }) =>
        screenSize === 'mobile' ? (
          <>
            <ButtonContainer>
              {blankVoteButtonForScreenSize(screenSize)}
            </ButtonContainer>
            <ButtonContainer>
              {backButton}
              {reviewBallotButtonForScreenSize(screenSize)}
            </ButtonContainer>
          </>
        ) : (
          <ButtonContainer alignLeft>
            {backButton}
            {blankVoteButtonForScreenSize(screenSize)}
            {reviewBallotButtonForScreenSize(screenSize)}
          </ButtonContainer>
        )
      }
    </ScreenSizeConsumer>
  );
};

export default BallotButtons;
