import React from 'react';
import { Trans } from 'react-i18next';

import { ScreenSizeConsumer } from 'providers/ScreenSize';
import Button, { ButtonContainer } from 'components/button';
import Link from 'components/link';

interface IProps {
  canSubmit: boolean;
  onReviewBallot: () => void;
  onBlankVote: () => void;
}

const BallotButtons: React.SFC<IProps> = ({
  canSubmit,
  onReviewBallot,
  onBlankVote,
}) => (
  <ScreenSizeConsumer>
    {({ screenSize }) =>
      (screenSize === 'mobile') ? (
        <>
          <ButtonContainer>
            <Link to="/voter">
              <Button text={<Trans>general.back</Trans>} secondary />
            </Link>
            <Button
              text={<Trans>election.showBallot</Trans>}
              disabled={!canSubmit}
              action={onReviewBallot}
            />
          </ButtonContainer>
          <ButtonContainer>
            <Button
              text={<Trans>election.blankVote</Trans>}
              action={onBlankVote}
              secondary
              fillWidth
              centerContent
            />
          </ButtonContainer>
        </>
      ) : (
        <ButtonContainer alignLeft>
          <Link to="/voter">
            <Button text={<Trans>general.back</Trans>} secondary />
          </Link>
          <Button
            text={<Trans>election.blankVote</Trans>}
            action={onBlankVote}
            secondary
          />
          <Button
            text={<Trans>election.showBallot</Trans>}
            disabled={!canSubmit}
            action={onReviewBallot}
          />
        </ButtonContainer>
      )
    }
  </ScreenSizeConsumer>
);

export default BallotButtons;
