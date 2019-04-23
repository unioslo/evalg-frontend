import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Field } from 'react-final-form';

import { ElectionGroup } from '../../../../../../interfaces';
import { PageSection } from '../../../../../../components/page';
import Modal from '../../../../../../components/modal';
import { TextInputRF } from '../../../../../../components/form';
import Button, { ButtonContainer } from '../../../../../../components/button';
import Spinner from '../../../../../../components/animations/Spinner';
import { sleep } from '../../../../../../utils';
import ModalSteps from './ModalSteps';
import { InfoList, InfoListItem } from '../../../../../../components/infolist';
import ElectionKeyCreatedByInfo from './ElectionKeyCreatedByInfo';

interface Props {
  electionGroup: ElectionGroup;
}

const CountVotesSection: React.FunctionComponent<Props> = ({
  electionGroup,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitPrivateKey = async (formValues: object) => {
    // TODO
    console.log(formValues);
    await sleep(2000);
  };

  return (
    <PageSection header={t('admin.counting.sectionHeader')}>
      <ButtonContainer alignLeft smlTopMargin>
        <Button
          text={t('admin.counting.startCounting')}
          action={handleShowModal}
        />
      </ButtonContainer>

      {showModal && (
        <Modal
          header={t('admin.counting.modalHeader')}
          buttons={[
            <Button
              key="cancel-button"
              text={t('general.cancel')}
              action={handleCloseModal}
              secondary
            />,
          ]}
          minWidth="80rem"
        >
          <>
            <InfoList maxWidth="100rem">
              <InfoListItem bulleted>
                {t('admin.counting.modalBullet1')}
              </InfoListItem>
              <InfoListItem bulleted>
                {t('admin.counting.modalBullet2FirstPart')}{' '}
                <ElectionKeyCreatedByInfo electionGroupId={electionGroup.id} />.
              </InfoListItem>
            </InfoList>
            <Form onSubmit={handleSubmitPrivateKey}>
              {formProps => {
                const { handleSubmit, pristine, submitting } = formProps;

                const step1ElectionKeyField = (
                  <Field
                    name="electionKey"
                    component={TextInputRF}
                    placeholder={t(
                      'admin.counting.electionKeyInputPlaceholder'
                    )}
                    containerWidth="100%"
                    noInputMaxWidth
                  />
                );

                const step2SubmitButton = (
                  <ButtonContainer center noTopMargin>
                    <Button
                      action={handleSubmit}
                      disabled={pristine || submitting}
                      text={
                        <>
                          <span>
                            {t('admin.counting.submitElectionKeyButton')}
                          </span>
                          {submitting && (
                            <>
                              {' '}
                              <Spinner size="2rem" marginLeft="0.8rem" thin />
                            </>
                          )}
                        </>
                      }
                    />
                  </ButtonContainer>
                );

                return (
                  <form>
                    <ModalSteps
                      width="70rem"
                      stepsContent={[step1ElectionKeyField, step2SubmitButton]}
                      stepsActiveStatus={[true, !pristine]}
                    />
                  </form>
                );
              }}
            </Form>
          </>
        </Modal>
      )}
    </PageSection>
  );
};

export default CountVotesSection;
