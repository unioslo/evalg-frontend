import { useTranslation } from 'react-i18next';

import Button, { ButtonContainer } from 'components/button';
import { ScreenSizeConsumer } from 'providers/ScreenSize';

interface EditButtonsProps {
  onGoBackToSelectList: () => void;
  onReviewBallot: () => void;
  reviewBallotEnabled: boolean;
}

export default function EditButtons({
  onGoBackToSelectList,
  onReviewBallot,
  reviewBallotEnabled,
}: EditButtonsProps) {
  const { t } = useTranslation();

  return (
    <ScreenSizeConsumer>
      {({ screenSize }) =>
        screenSize === 'mobile' ? (
          <ButtonContainer>
            <Button
              text={t('general.back')}
              action={onGoBackToSelectList}
              secondary
            />
            <Button
              text={t('voter.reviewBallot')}
              disabled={!reviewBallotEnabled}
              action={onReviewBallot}
            />
          </ButtonContainer>
        ) : (
          <ButtonContainer alignLeft>
            <Button
              text={t('general.back')}
              action={onGoBackToSelectList}
              secondary
            />

            <Button
              text={t('voter.reviewBallot')}
              disabled={!reviewBallotEnabled}
              action={onReviewBallot}
            />
          </ButtonContainer>
        )
      }
    </ScreenSizeConsumer>
  );
}
