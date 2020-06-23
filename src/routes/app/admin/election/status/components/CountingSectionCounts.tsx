import React from 'react';
import { Query } from 'react-apollo';
import { useTranslation } from 'react-i18next';

import CountsTable from './CountsTable';
import {
  PageExpandableSubSection,
  PageSubSection,
} from 'components/page/PageSection';
import Spinner from 'components/animations/Spinner';
import { electionGroupCountsQuery } from './CountingSection';

const MAX_COUNTS_ENTRIES_WITHOUT_CLICK_TO_EXPAND = 5;

interface IProps {
  electionGroupId: string;
}

const CountingSectionCounts: React.FunctionComponent<IProps> = ({
  electionGroupId,
}) => {
  const { t } = useTranslation();

  return (
    <Query query={electionGroupCountsQuery} variables={{ id: electionGroupId }}>
      {(result: any) => {
        const { data, loading, error } = result;
        if (error) {
          return (
            <PageSubSection
              header={t('admin.countingSection.countingsSubsection.header')}
            >
              {t(
                'admin.countingSection.countingsSubsection.errors.couldNotLoadCountings'
              )}
              : {error.message}
            </PageSubSection>
          );
        }

        if (loading) {
          return (
            <PageSubSection
              header={t('admin.countingSection.countingsSubsection.header')}
            >
              <Spinner darkStyle />
            </PageSubSection>
          );
        }

        const nCounts = data.electionGroupCountingResults.length;

        if (nCounts > 0) {
          const subSectionHeading = `${t(
            'admin.countingSection.countingsSubsection.header'
          )} (${data.electionGroupCountingResults.length})`;

          return nCounts <= MAX_COUNTS_ENTRIES_WITHOUT_CLICK_TO_EXPAND ? (
            <PageSubSection header={subSectionHeading}>
              <CountsTable
                electionGroupCounts={data.electionGroupCountingResults}
              />
            </PageSubSection>
          ) : (
            <PageExpandableSubSection header={subSectionHeading}>
              <CountsTable
                electionGroupCounts={data.electionGroupCountingResults}
              />
            </PageExpandableSubSection>
          );
        }
        return null;
      }}
    </Query>
  );
};

export default CountingSectionCounts;
