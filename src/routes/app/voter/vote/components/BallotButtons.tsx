import React from 'react';
import { useTranslation } from 'react-i18next';

import { ScreenSizeConsumer } from 'providers/ScreenSize';
import Button, { ButtonContainer } from 'components/button';

interface IProps {
  onGoBackToSelectVoterGroup: () => void;
  onBlankVote: () => void;
  onReviewBallot: () => void;
  reviewBallotEnabled: boolean;
  showBlankVoteButton?: boolean;
}

const BallotButtons: React.FunctionComponent<IProps> = ({
  onGoBackToSelectVoterGroup,
  onBlankVote,
  showBlankVoteButton,
  reviewBallotEnabled,
  onReviewBallot,
}) => {
  const { t } = useTranslation();

  const backButton = (
    <Button
      text={t('general.back')}
      action={onGoBackToSelectVoterGroup}
      secondary
    />
  );

  const blankVoteButtonForScreenSize = (screenSize: string) => (
    <Button
      text={t('election.blankVote')}
      action={onBlankVote}
      secondary
      fillWidth={screenSize === 'mobile'}
      centerContent={screenSize === 'mobile'}
    />
  );

  const reviewBallotButtonForScreenSize = (screenSize: string) => (
    <Button
      text={
        screenSize === 'mobile' || screenSize === 'sm'
          ? t('voter.reviewBallotMobile')
          : t('voter.reviewBallot')
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
            {showBlankVoteButton && (
              <ButtonContainer>
                {blankVoteButtonForScreenSize(screenSize)}
              </ButtonContainer>
            )}
            <ButtonContainer>
              {backButton}
              {reviewBallotButtonForScreenSize(screenSize)}
            </ButtonContainer>
          </>
        ) : (
          <ButtonContainer alignLeft>
            {backButton}
            {showBlankVoteButton && blankVoteButtonForScreenSize(screenSize)}
            {reviewBallotButtonForScreenSize(screenSize)}
          </ButtonContainer>
        )
      }
    </ScreenSizeConsumer>
  );
};

export default BallotButtons;
