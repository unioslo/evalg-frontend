import React from 'react';
import { Trans } from 'react-i18next';

import { ScreenSizeConsumer } from '../../../../../providers/ScreenSize';
import Button, { ButtonContainer } from '../../../../../components/button';
import Link from '../../../../../components/link';

interface IProps {
  reviewBallotEnabled: boolean;
  onReviewBallot: () => void;
  onBlankVote: () => void;
}

const BallotButtons: React.SFC<IProps> = ({
  reviewBallotEnabled,
  onReviewBallot,
  onBlankVote,
}) => {
  const backButton = (
    <Link to="/voter">
      <Button text={<Trans>general.back</Trans>} secondary />
    </Link>
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
              {backButton}
              {reviewBallotButtonForScreenSize(screenSize)}
            </ButtonContainer>
            <ButtonContainer>
              {blankVoteButtonForScreenSize(screenSize)}
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
