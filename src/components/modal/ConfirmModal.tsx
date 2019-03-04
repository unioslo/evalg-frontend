import * as React from 'react';

import { Button } from '../../components/button';
import Modal from '.';


interface IProps {
    closeAction: () => void,
    confirmAction: () => void,
    header: React.ReactNode,
    body: React.ReactNode,
    confirmText: React.ReactNode,
    closeText: React.ReactNode
}

const ConfirmModal: React.SFC<IProps> = (props) => {
    const buttons = [
        <Button
            key="close"
            action={props.closeAction}
            text={props.closeText}
        />,
        <Button
            key="confirm"
            action={props.confirmAction}
            text={props.confirmText}
            secondary={true}
        />
    ];
    return (
        <Modal
            closeAction={props.closeAction}
            header={props.header}
            buttons={buttons}>
            {props.body}
        </Modal>
    )
}
export default ConfirmModal;