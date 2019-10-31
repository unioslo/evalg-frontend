import React, { useState } from 'react';
import FileSaver from 'file-saver';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { useTranslation } from 'react-i18next';

import Spinner from 'components/animations/Spinner';
import Button from 'components/button'
import { ElectionGroup, Election, IPollBook } from 'interfaces';



const electionGroupVoterDumpQuery = gql`
  query electionGroup($id: UUID!) {
    electionGroup(id: $id) {
      id
      name
      elections {
        id
        name
        pollbooks {
          id
          name
          voterDump
        }
      }
    }
  }
`;

interface PollbookDumperProps {
  electionGroup: ElectionGroup
}

const VoterCSVDumper: React.FunctionComponent<PollbookDumperProps> = ({ electionGroup }) => {
  const [isGeneratingFile, setIsGeneratingFile] = useState(false)
  const { i18n, t } = useTranslation();

  if (isGeneratingFile) {
    return (
      <Query
        query={electionGroupVoterDumpQuery}
        variables={{ id: electionGroup.id }}
        fetchPolicy="network-only"
      >
        {({ data, loading, error, refetch }) => {

          if (loading) {
            return (
              <>
                <Button text={t('census.download.button')} disabled secondary />
                <Spinner size="2.2rem" darkStyle marginRight="1rem" marginTop="1rem" />
                {t('census.download.generating')}
              </>
            )
          }
          const csv_data = data.electionGroup.elections.flatMap((e: Election) =>
            e.pollbooks
          ).flatMap((p: IPollBook) =>
            p.voterDump.map(v =>
              [p.name[i18n.language], v[0], v[1]]
            )
          ).map((v: string[]) =>
            v.join(';')
          ).join('\r\n')

          const blob = new Blob([csv_data], {
            type: 'text/csv;charset=utf-8',
          });

          FileSaver.saveAs(blob, `voter_dump-${electionGroup.name[i18n.language]}.csv`)
          setIsGeneratingFile(false);
          return (
            <>
            </>
          )
        }}
      </Query>
    )
  }
  return (
    <Button text={t('census.download.button')} secondary action={(event: any) => setIsGeneratingFile(true)} />
  )

};

export default VoterCSVDumper;