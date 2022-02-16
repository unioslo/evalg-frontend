import React from 'react';

import { Button } from 'components/button';
import Modal from '.';

type ConfirmModalProps = {
  closeAction: () => void;
  confirmAction: () => void;
  header: React.ReactNode;
  body: React.ReactNode;
  confirmText: React.ReactNode;
  closeText: React.ReactNode;
  danger?: boolean;
};

export default function ConfirmModal(props: ConfirmModalProps) {
  const {
    body,
    closeAction,
    closeText,
    confirmAction,
    confirmText,
    danger,
    header,
  } = props;

  const buttons = [
    <Button key="close" action={closeAction} text={closeText} />,
    <Button
      key="confirm"
      action={confirmAction}
      text={confirmText}
      secondary={!danger}
      dangerButton={danger}
    />,
  ];
  return (
    <Modal closeAction={closeAction} header={header} buttons={buttons}>
      {body}
    </Modal>
  );
}

ConfirmModal.defaultProps = {
  danger: false,
};
