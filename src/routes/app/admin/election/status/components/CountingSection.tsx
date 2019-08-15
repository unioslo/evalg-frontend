import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { ElectionGroup } from 'interfaces';
import { ElectionGroupCountFields } from 'fragments';

import { PageSection } from 'components/page';
import Button, { ButtonContainer } from 'components/button';
import CountingModal from './CountingModal';
import CountingSectionCounts from './CountingSectionCounts';
import { Classes } from 'jss';
import injectSheet from 'react-jss';
import { schemaDefinitionNotAloneMessage } from 'graphql/validation/rules/LoneSchemaDefinition';
import { isUndefined } from 'util';
import Spinner from 'components/animations/Spinner';

export const electionGroupCountsQuery = gql`
  ${ElectionGroupCountFields}
  query electionGroupCounts($id: UUID!) {
    electionGroupCountingResults(id: $id) {
      ...ElectionGroupCountFields
    }
  }
`;

const styles = (theme: any) => ({
  countingNotAllowedContainer: {
    color: theme.colors.darkRed,
    alignItems: 'center',
    textAlign: 'center',
  },
});

interface Props {
  electionGroup: ElectionGroup;
  scrollToStatusRef: React.RefObject<HTMLDivElement>;
  selfAddedVoters: any;
  categorizedVoters: any;
  personsWithMultipleVerifiedVoters: any;
  classes: Classes;
}

const CountingSection: React.FunctionComponent<Props> = ({
  electionGroup,
  scrollToStatusRef,
  selfAddedVoters,
  categorizedVoters,
  personsWithMultipleVerifiedVoters,
  classes,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const loadingParentQueries =
    selfAddedVoters.loading || personsWithMultipleVerifiedVoters.loading;
  const errorParentQueries =
    selfAddedVoters.error || personsWithMultipleVerifiedVoters.error;
  const { t } = useTranslation();

  const getMessage = () => {
    if (!(selfAddedVoters.loading || selfAddedVoters.error)) {
      if (categorizedVoters.notReviewedVoters.length > 0) {
        return t(`admin.countingSection.notAllowedSelfAddedVoters`);
      }
    }
    if (
      !(
        personsWithMultipleVerifiedVoters.loading ||
        personsWithMultipleVerifiedVoters.error
      )
    ) {
      if (
        personsWithMultipleVerifiedVoters.data.personsWithMultipleVerifiedVoters
          .length > 0
      ) {
        return t(`admin.countingSection.notAllowedPersonsWithMultipleVoters`);
      }
    }
    return '';
  };

  const handleShowModal = () => {
    console.error(selfAddedVoters, 'selfAdded');
    console.error(personsWithMultipleVerifiedVoters, 'persons');

    const tempMessage = getMessage();

    if (tempMessage === '') {
      setShowModal(true);
    } else {
      setMessage(tempMessage);
    }
  };

  const handleCancelModal = () => {
    setShowModal(false);
  };

  const handleCloseModalAndSeeResults = () => {
    setShowModal(false);
    if (scrollToStatusRef.current) {
      setTimeout(
        () =>
          scrollToStatusRef.current &&
          scrollToStatusRef.current.scrollIntoView(),
        0
      );
    }
  };

  console.error('isLoading', loadingParentQueries);

  return (
    <PageSection header={t('admin.countingSection.header')}>
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
                      ? t('admin.countingSection.startCounting')
                      : t('admin.countingSection.startNewCounting')
                  }
                  action={handleShowModal}
                  secondary={!showFirstTimeCountingButton}
                />
              );
            }}
          </Query>
          {/* {loadingParentQueries && <Spinner darkStyle />} */}
          <div className={classes.countingNotAllowedContainer}>
            <p>{message}</p>
          </div>
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

export default injectSheet(styles)(CountingSection);
