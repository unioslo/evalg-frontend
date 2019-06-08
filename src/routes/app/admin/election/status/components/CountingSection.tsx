import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { ElectionGroup } from 'interfaces';
import { ElectionGroupCountFields } from 'fragments';

import { PageSection } from 'components/page';
import Button, { ButtonContainer } from 'components/button';
import CountingModal from './CountingModal';
import CountingSectionCounts from './CountingSectionCounts';

export const electionGroupCountsQuery = gql`
  ${ElectionGroupCountFields}
  query electionGroupCounts($id: UUID!) {
    electionGroupCountingResults(id: $id) {
      ...ElectionGroupCountFields
    }
  }
`;

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
          <Query
            query={electionGroupCountsQuery}
            variables={{ id: electionGroup.id }}
          >
            {({ data, loading, error }) => {
              const showFirstTimeCountingButton =
                error ||
                loading ||
                data.electionGroupCountingResults.length === 0;

              return (
                <Button
                  text={
                    showFirstTimeCountingButton
                      ? t('admin.counting.startCounting')
                      : t('admin.counting.startNewCounting')
                  }
                  action={handleShowModal}
                  secondary={!showFirstTimeCountingButton}
                />
              );
            }}
          </Query>
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

      <CountingSectionCounts electionGroupId={electionGroup.id} />
    </PageSection>
  );
};

export default CountingSection;
