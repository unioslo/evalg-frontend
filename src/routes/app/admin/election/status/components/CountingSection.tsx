import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ElectionGroup } from '../../../../../../interfaces';
import { PageSection } from '../../../../../../components/page';
import Button, { ButtonContainer } from '../../../../../../components/button';
import CountingModal from './CountingModal';

interface Props {
  electionGroup: ElectionGroup;
  scrollToStatusRef: React.RefObject<HTMLDivElement>;
}

const CountingSection: React.FunctionComponent<Props> = ({
  electionGroup,
  scrollToStatusRef,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCancelModal = () => {
    setShowModal(false);
  };

  const handleCloseModalAndSeeResults = () => {
    setShowModal(false);
    if (scrollToStatusRef.current) {
      console.log(scrollToStatusRef);
      setTimeout(
        () =>
          scrollToStatusRef.current &&
          scrollToStatusRef.current.scrollIntoView(),
        0
      );
    }
  };

  return (
    <PageSection header={t('admin.counting.sectionHeader')}>
      {electionGroup.status === 'closed' ? (
        <ButtonContainer alignLeft smlTopMargin>
          <Button
            text={t('admin.counting.startCounting')}
            action={handleShowModal}
          />
        </ButtonContainer>
      ) : (
        t('election.electionNotClosed')
      )}

      {showModal && (
        <CountingModal
          electionGroup={electionGroup}
          onCancelModal={handleCancelModal}
          onCloseModalAndSeeResults={handleCloseModalAndSeeResults}
        />
      )}
    </PageSection>
  );
};

export default CountingSection;
