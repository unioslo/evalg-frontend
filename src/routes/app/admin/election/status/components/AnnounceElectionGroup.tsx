import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'components/modal';
import Button from 'components/button';
import Text from 'components/text';
import Link from 'components/link';
import ActionText from 'components/actiontext';
import { ElectionGroup } from 'interfaces';


interface IProps {
  electionGroup: ElectionGroup;
  announceAction: (id: string) => void;
  unannounceAction: (id: string) => void;
}


/**
 * Component for announcing and unannouncing elections.
 */
const AnnounceElectionGroup: React.FunctionComponent<IProps> = (props: IProps) => {
  const [showConfirmAnnounceModal, setShowConfirmAnnounceModal] = useState(false);
  const [showConfirmUnannounceModal, setShowConfirmUnannounceModal] = useState(false);
  const { t } = useTranslation();

  const showConfirmAnnounceDialog = () => {
    setShowConfirmAnnounceModal(true);
  }

  const closeConfirmAnnounceDialog = () => {
    setShowConfirmAnnounceModal(false);
  }

  const showConfirmUnannounceDialog = () => {
    setShowConfirmUnannounceModal(true);
  }

  const closeConfirmUnannounceDialog = () => {
    setShowConfirmUnannounceModal(false);
  }

  const handleAnnounce = () => {
    props.announceAction(props.electionGroup.id);
    setShowConfirmAnnounceModal(false);
  }

  const handleUnannounce = () => {
    props.unannounceAction(props.electionGroup.id);
    setShowConfirmUnannounceModal(false);
  }

  const renderAnnounceButton = (action: () => void) => (
    <Button
      key="announce"
      text={t('election.announceElectionConfirm')}
      action={action}
    />
  );

  const renderUnannounceButton = (action: () => void) => (
    <Button
      key="unannounce"
      text={t('election.unannounceElectionConfirm')}
      action={action}
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

  const renderAnnounce = () => {
    return (
      <span>
        <ActionText action={showConfirmAnnounceDialog} bottom>
          {t('election.statusDoAnnounce')}
        </ActionText>
        {showConfirmAnnounceModal && (
          <Modal
            header={t('election.announceElectionHeader')}
            buttons={[
              renderCancelButton(closeConfirmAnnounceDialog),
              renderAnnounceButton(handleAnnounce),
            ]}
            closeAction={closeConfirmAnnounceDialog}
            hideTopCloseButton
          >
            <p><Text>{t('election.announceElectionInfoOne')}</Text></p>
            <p><Text>{t('election.announceElectionInfoTwo')}</Text></p>
            <p>
              <Text>
                <Link external to="https://www.uio.no/tjenester/it/applikasjoner/e-valg/hjelp/publisering.html/">
                  {t('election.announceElectionReadMore')}
                </Link>
              </Text>
            </p>
          </Modal>
        )}
      </span>
    );
  }

  const renderUnannounce = () => {
    return (
      <span>
        <ActionText action={showConfirmUnannounceDialog} bottom>
          {t('election.statusDoUnannounce')}
        </ActionText>
        {showConfirmUnannounceModal && (
          <Modal
            header={t('election.unannounceElectionHeader')}
            buttons={[
              renderCancelButton(closeConfirmUnannounceDialog),
              renderUnannounceButton(handleUnannounce),
            ]}
            closeAction={closeConfirmUnannounceDialog}
            hideTopCloseButton
          >
            <p><Text>{t('election.unannounceElectionInfoOne')}</Text></p>
            <p><Text>{t('election.unannounceElectionInfoTwo')}</Text></p>
            <p>
              <Text>
                <Link external to="https://www.uio.no/tjenester/it/applikasjoner/e-valg/hjelp/publisering.html/">
                  {t('election.announceElectionReadMore')}
                </Link>
              </Text>
            </p>
          </Modal>
        )}
      </span>
    );
  }

  return (
    <span>
      {!props.electionGroup.announced && renderAnnounce()}
      {props.electionGroup.announced && renderUnannounce()}
    </span>
  )
}

export default AnnounceElectionGroup;
