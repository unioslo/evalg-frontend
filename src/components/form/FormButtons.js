/* @flow */
import * as React from 'react';

import { Trans } from 'react-i18next';
import Button, { ButtonContainer } from 'components/button';

type Props = {
  saveAction: Function,
  closeAction: Function,
  submitDisabled: boolean,
  entityAction?: Function,
  entityText?: React.Node | string
}

const FormButtons = (props: Props) => {
  const {
    saveAction, closeAction, submitDisabled, entityAction, entityText
  } = props;
  return (
    <ButtonContainer alignRight>
      {entityAction && entityText &&
        <Button
          text={entityText}
          action={entityAction}
          secondary />
      }
      <Button
        text={<Trans>general.cancel</Trans>}
        action={closeAction}
        secondary />
      <Button
        text={<Trans>general.save</Trans>}
        disabled={submitDisabled}
        action={saveAction}
      />
    </ButtonContainer>
  )
};

export default FormButtons;