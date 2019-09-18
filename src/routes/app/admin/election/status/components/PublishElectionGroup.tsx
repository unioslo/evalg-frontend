import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Text from 'components/text';
import Button, { ButtonContainer } from 'components/button';
import Modal from 'components/modal';
import { ElectionGroup } from 'interfaces';


interface IProps {
  electionGroup: ElectionGroup;
  publishAction: (id: string) => void;
  unpublishAction: (id: string) => void;
  canPublish: boolean;
}

/**
 * Component used to publish and unpublish election groups.
 *
 */
const PublishElectionGroup: React.FunctionComponent<IProps> = (props: IProps) => {

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const { t } = useTranslation();

  const { electionGroup } = props;

  const showPublishDialog = () => {
    setShowPublishModal(true);
  }

  const closePublishDialog = () => {
    setShowPublishModal(false);
  }

  const showUnpublishDialog = () => {
    setShowUnpublishModal(true);
  }

  const closeUnpublishDialog = () => {
    setShowUnpublishModal(false);
  }

  const handlePublish = () => {
    props.publishAction(props.electionGroup.id);
    closePublishDialog();
  }

  const handleUnpublish = () => {
    props.unpublishAction(props.electionGroup.id);
    setShowUnpublishModal(false);
  }

  const renderPublishButton = () => (
    <Button
      key="publish"
      text={t('election.publish')}
      action={handlePublish}
    />
  );

  const renderUnpublishButton = () => (
    <Button
      key="unpublish"
      text={t('election.unpublishElection')}
      action={handleUnpublish}
    />
  );

  const renderCancelButton = (action: () => void) => (
    <Button
      key="cancel"
      text={t('general.cancel')}
      action={action}
      secondary
    />
  );

  const renderPublish = () => {
    return (
      <div>
        <ButtonContainer alignLeft smlTopMargin>
          <Button
            text={t('election.publishElection')}
            action={showPublishDialog}
            disabled={!props.canPublish}
          />
        </ButtonContainer>
        {showPublishModal && (
          <Modal
            header={t('election.publishElection')}
            buttons={[
              renderCancelButton(closePublishDialog),
              renderPublishButton(),
            ]}
            closeAction={() => setShowPublishModal(false)}
            hideTopCloseButton
          >
            <Text>{t('election.publishElectionModalInfo')}</Text>
          </Modal>
        )}
      </div>
    );
  }

  const renderUnpublish = () => {
    return (
      <div>
        <ButtonContainer alignLeft smlTopMargin>
          <Button
            text={t('election.unpublishElection')}
            action={showUnpublishDialog}
            secondary
            disabled={!props.canPublish}
          />
        </ButtonContainer>
        {showUnpublishModal && (
          <Modal
            header={t('election.unpublishElection')}
            buttons={[
              renderCancelButton(closeUnpublishDialog),
              renderUnpublishButton(),
            ]}
            closeAction={closeUnpublishDialog}
            hideTopCloseButton
          >
            <Text>{t('election.unpublishElectionModalInfo')}</Text>
          </Modal>
        )}
      </div>
    );
  }

  return (
    <span>
      {!electionGroup.published && renderPublish()}
      {electionGroup.published && renderUnpublish()}
    </span>
  )
}

export default PublishElectionGroup;
