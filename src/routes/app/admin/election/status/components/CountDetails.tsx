import React, { useState } from 'react';
import gql from 'graphql-tag';
import { withApollo, WithApolloClient } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { useTranslation } from 'react-i18next';
import FileSaver from 'file-saver';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import { ElectionGroupCount } from 'interfaces';
import Spinner from 'components/animations/Spinner';
import { H3 } from 'components/text';
import { orderElectionResults } from 'utils/processGraphQLData';

import ElectionResultAndBallotStats from './ElectionResultAndBallotStats';

const electionResultBallots = gql`
  query electionResult($id: UUID!) {
    electionResult(id: $id) {
      id
      ballotsWithMetadata
      election {
        id
        name
      }
    }
  }
`;

const styles = (theme: any) => ({
  electionSection: {
    marginBottom: '2rem',
    borderBottom: `1px solid ${theme.tableCandidateBottomBorderColor}`,
    paddingBottom: '2rem',
  },
  auditLogSection: {
    marginBottom: '2rem',
  },
  electionResultFileDownloads: {
    display: 'flex',
  },
  verticalLineSeparator: {
    margin: '0 0.7rem',
  },
  fileDownloadErrorMessage: {
    marginBottom: '1rem',
    color: theme.errorTextColor,
  },
  electedCandidatesList: {
    listStylePosition: 'inside',
  },
});

interface IProps {
  electionGroupCount: ElectionGroupCount;
  classes: Classes;
}

const CountDetails: React.FunctionComponent<WithApolloClient<IProps>> = ({
  electionGroupCount,
  classes,
  client: apolloClient,
}) => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  const [
    downloadingFileElectionResultId,
    setDownloadingFileElectionResultId,
  ] = useState('');
  const [fileDownloadError, setFileDownloadError] = useState('');

  let electionResults = electionGroupCount.electionResults;
  electionResults = orderElectionResults(electionResults);

  const handleDownloadBallots = async (
    apolloClient: ApolloClient<any>,
    electionResultId: string
  ) => {
    setDownloadingFileElectionResultId(electionResultId);
    setFileDownloadError('');

    let ballotsWithMetadata, electionName;
    try {
      const { data } = await apolloClient.query({
        query: electionResultBallots,
        variables: { id: electionResultId },
        fetchPolicy: 'no-cache',
      });
      ballotsWithMetadata = data.electionResult.ballotsWithMetadata;
      electionName = data.electionResult.election.name[lang];
      setDownloadingFileElectionResultId('');
    } catch (error) {
      setDownloadingFileElectionResultId('');
      setFileDownloadError(error.message);
      return;
    }

    const blob = new Blob([JSON.stringify(ballotsWithMetadata, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    FileSaver.saveAs(blob, `ballots-${electionName}.json`);
  };

  return (
    <>
      {fileDownloadError && (
        <div className={classes.fileDownloadErrorMessage}>
          {`${t(
            'admin.countingDetails.errors.fileDownloadError'
          )}: ${fileDownloadError}`}
        </div>
      )}

      {electionResults
        .filter(electionResult => electionResult.election.active)
        .map(electionResult => {
          const election = electionResult.election;
          const electionName = election.name[lang];

          return (
            <div key={electionResult.id} className={classes.electionSection}>
              {election.electionGroup.type === 'multiple_elections' && (
                <H3>{electionName}</H3>
              )}

              <ElectionResultAndBallotStats electionResult={electionResult} />

              <div className={classes.electionResultFileDownloads}>
                <span>
                  {t('admin.countingDetails.countingProtocol')}:{' '}
                  <a href="#">{t('general.download')} (PDF)</a>
                </span>
                <span className={classes.verticalLineSeparator}>|</span>
                <span>
                  {t('admin.countingDetails.ballots')}:{' '}
                  <a
                    onClick={() =>
                      handleDownloadBallots(apolloClient, electionResult.id)
                    }
                  >
                    {t('general.download')} (JSON)
                  </a>
                </span>
                {downloadingFileElectionResultId === electionResult.id && (
                  <Spinner darkStyle size="1.6rem" marginLeft="1rem" />
                )}
              </div>
            </div>
          );
        })}

      <div className={classes.auditLogSection}>
        {electionResults.length > 1
          ? t('admin.countingDetails.auditLogForAllElections')
          : t('admin.countingDetails.auditLogForElection')}
        : <a href="#">{t('general.download')}</a>
      </div>
    </>
  );
};

export default injectSheet(styles)(withApollo(CountDetails));
