import React, { useState } from 'react';
import { ApolloClient, gql } from '@apollo/client';
import { withApollo, WithApolloClient } from '@apollo/client/react/hoc';
import { useTranslation } from 'react-i18next';
import FileSaver from 'file-saver';
import { createUseStyles, useTheme } from 'react-jss';

import Button, { ButtonContainer } from 'components/button';
import { ElectionGroupCount } from 'interfaces';
import Spinner from 'components/animations/Spinner';
import { H3 } from 'components/text';
import { orderElectionResults } from 'utils/processGraphQLData';

import ElectionResultAndBallotStats from './ElectionResultAndBallotStats';
import PollResultAndBallotStats from './PollResultAndBallotStats';

const countingProtocolDownloadQuery = gql`
  query countingProtocolDownload($id: UUID!) {
    electionResult(id: $id) {
      id
      electionProtocol
      election {
        id
        name
      }
    }
  }
`;

const ballotsWithMetadataDownloadQuery = gql`
  query ballotsWithMetadataDownload($id: UUID!) {
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

const useStyles = createUseStyles((theme: any) => ({
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
  externalLink: {
    color: theme.linkExternalColor,
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
}));

interface IProps {
  electionGroupCount: ElectionGroupCount;
}

const CountDetails: React.FunctionComponent<WithApolloClient<IProps>> = ({
  electionGroupCount,
  client: apolloClient,
}) => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const theme = useTheme();
  const classes = useStyles({ theme });
  const [processingFileForERId, setProcessingFileForERId] = useState('');
  const [fileDownloadError, setFileDownloadError] = useState('');

  let { electionResults } = electionGroupCount;
  electionResults = orderElectionResults(electionResults);

  const handleDownloadCountingProtocol = async (
    client: ApolloClient<any>,
    electionResultId: string
  ) => {
    setProcessingFileForERId(electionResultId);
    setFileDownloadError('');

    let countingProtocol;
    let electionName;
    try {
      const { data } = await client.query({
        query: countingProtocolDownloadQuery,
        variables: { id: electionResultId },
        fetchPolicy: 'no-cache',
      });
      countingProtocol = data.electionResult.electionProtocol;
      electionName = data.electionResult.election.name[lang];
    } catch (error: any) {
      setProcessingFileForERId('');
      setFileDownloadError(error.message);
      return;
    }

    const blob = new Blob([countingProtocol], {
      type: 'text/plain;charset=utf-8',
    });

    setProcessingFileForERId('');
    FileSaver.saveAs(blob, `counting_protocol-${electionName}.txt`);
  };

  const handleDownloadBallots = async (
    client: ApolloClient<any>,
    electionResultId: string
  ) => {
    setProcessingFileForERId(electionResultId);
    setFileDownloadError('');

    let ballotsWithMetadata;
    let electionName;
    try {
      const { data } = await client.query({
        query: ballotsWithMetadataDownloadQuery,
        variables: { id: electionResultId },
        fetchPolicy: 'no-cache',
      });
      ({ ballotsWithMetadata } = data.electionResult);
      electionName = data.electionResult.election.name[lang];
    } catch (error: any) {
      setProcessingFileForERId('');
      setFileDownloadError(error.message);
      return;
    }

    const blob = new Blob([JSON.stringify(ballotsWithMetadata, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    setProcessingFileForERId('');
    FileSaver.saveAs(blob, `ballots-${electionName}.json`);
  };

  if (!apolloClient) {
    // TODO handle better.
    setFileDownloadError('ApolloClient missing!');
    return <></>;
  }

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
        .filter((electionResult) => electionResult.election.active)
        .map((electionResult) => {
          const { election } = electionResult;
          const electionName = election.name[lang];

          return (
            <div key={electionResult.id} className={classes.electionSection}>
              {election.electionGroup.type === 'multiple_elections' && (
                <H3>{electionName}</H3>
              )}
              {electionResult.result.meta.election_type === 'poll' ? (
                <PollResultAndBallotStats electionResult={electionResult} />
              ) : (
                <ElectionResultAndBallotStats electionResult={electionResult} />
              )}
              <div className={classes.electionResultFileDownloads}>
                <ButtonContainer>
                  <Button
                    action={(e) => {
                      e.preventDefault();
                      handleDownloadCountingProtocol(
                        apolloClient,
                        electionResult.id
                      );
                    }}
                    text={
                      <span>
                        {t('general.download')}{' '}
                        {t('admin.countingDetails.countingProtocol')} (TXT)
                      </span>
                    }
                    secondary
                  />
                  <Button
                    action={(e) => {
                      e.preventDefault();
                      handleDownloadBallots(apolloClient, electionResult.id);
                    }}
                    text={
                      <span>
                        {t('general.download')}{' '}
                        {t('admin.countingDetails.ballots')} (JSON)
                      </span>
                    }
                    secondary
                  />
                </ButtonContainer>
                {processingFileForERId === electionResult.id && (
                  <Spinner darkStyle size="1.6rem" marginLeft="1rem" />
                )}
              </div>
            </div>
          );
        })}
    </>
  );
};

export default withApollo<IProps>(CountDetails);
