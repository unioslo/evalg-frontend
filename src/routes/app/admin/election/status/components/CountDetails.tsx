import React, { useState } from 'react';
import gql from 'graphql-tag';
import { withApollo, WithApolloClient } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { useTranslation } from 'react-i18next';
import FileSaver from 'file-saver';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import { ElectionGroupCount } from 'interfaces';
import { orderElectionResults } from 'utils/processGraphQLData';
import Spinner from 'components/animations/Spinner';

const electionResultVotes = gql`
  query electionResult($id: UUID!) {
    electionResult(id: $id) {
      id
      votes
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
    '& div': {
      '&:not(:last-child)': {
        marginBottom: '2rem',
      },
    },
  },
  auditLogSubSection: {
    marginBottom: '2rem',
  },
  electionHeading: {
    marginBottom: '2rem',
  },
  subHeading: {
    marginBottom: '1rem',
  },
  votingPercantageRow: {
    marginBottom: '0.5rem',
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

    let ballots, electionName;
    try {
      const { data } = await apolloClient.query({
        query: electionResultVotes,
        variables: { id: electionResultId },
        fetchPolicy: 'no-cache',
      });
      ballots = data.electionResult.votes;
      electionName = data.electionResult.election.name[lang];
      setDownloadingFileElectionResultId('');
    } catch (error) {
      setDownloadingFileElectionResultId('');
      setFileDownloadError(error.message);
      return;
    }

    const blob = new Blob([JSON.stringify(ballots, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    FileSaver.saveAs(blob, `ballots-${electionName}.json`);
  };

  return (
    <>
      {fileDownloadError && (
        <div className={classes.fileDownloadErrorMessage}>
          Noe gikk galt under nedlasting av en fil: {fileDownloadError}
        </div>
      )}

      {electionResults.map(electionResult => {
        const electionName = electionResult.election.name[lang];
        const pollbooks = electionResult.election.pollbooks;
        const isActiveElection = electionResult.election.active;

        if (!isActiveElection) {
          return null;
        }

        return (
          <div key={electionResult.id} className={classes.electionSection}>
            {electionResults.length > 1 && (
              <h3 className={classes.electionHeading}>{electionName}</h3>
            )}
            <div>
              <h4 className={classes.subHeading}>{t('admin.countingDetails.electionResult')}</h4>
              <em>Valgresultat</em>
            </div>

            <div className={classes.electionResultFileDownloads}>
              <span>
                {t('admin.countingDetails.countingProtocol')}: <a href="#">{t('general.download')}</a>
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
      <div className={classes.auditLogSubSection}>
        {electionResults.length > 1
          ? t('admin.countingDetails.auditLogForAllElections')
          : t('admin.countingDetails.auditLogForElection')}
        : <a href="#">{t('general.download')}</a>
      </div>
    </>
  );
};

export default injectSheet(styles)(withApollo(CountDetails));
