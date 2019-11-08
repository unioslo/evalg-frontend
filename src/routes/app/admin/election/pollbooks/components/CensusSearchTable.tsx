import React, { useState } from 'react';
import { ElectionGroup, IVoter, IPollBook } from 'interfaces';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Spinner from 'components/animations/Spinner';
import { Table, TableHeader, TableHeaderRow, TableHeaderCell, TableBody, TableRow, TableCell } from 'components/table';
import { useTranslation } from 'react-i18next';
import { TextInput, DropDown } from 'components/form';
import { PageSection } from 'components/page';


const voterSearchQuery = gql`
  query($electionGroupId: UUID!, $limit: Int, $search: String) {
    searchVoters(electionGroupId: $electionGroupId, limit: $limit, search: $search ) {
      id
      idType
      idValue
      reviewed
      verified
      verifiedStatus
      hasVoted
      pollbook{
        id
        name
      }
    }
  }
`;


interface IProps {
  electionGroup: ElectionGroup;
}

const CensusSearchTable: React.FunctionComponent<IProps> = ({ electionGroup }) => {
  const { t, i18n } = useTranslation();
  const [searchString, setSearchString] = useState('')
  const [pollbookFilter, setPollbookFilter] = useState('')

  const search = (s: string) => {
    setSearchString(s);
  }


  const pollbooks: Array<IPollBook> = electionGroup.elections.filter(e => e.active
  ).flatMap(e => e.pollbooks)

  const pollbookFilterOptions = pollbooks.map(p => {
    return (
      {
        name: p.name[i18n.language],
        value: p.id
      })
  })


  console.info('**************')
  console.info(pollbookFilterOptions)
  console.info('**************')

  return (
    <>
      <PageSection header='Søk i manntall'>

        <TextInput
          label='Søk på id'
          onChange={search}
          name='Test'
          value={searchString}
        />

        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>ID-Type</TableHeaderCell>
              <TableHeaderCell>Identitet</TableHeaderCell>
              <TableHeaderCell>Gruppe</TableHeaderCell>
              <TableHeaderCell>Har stemt</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>

            <TableRow>
              <TableCell>
                <DropDown
                  options={[{ name: 'feide-id', value: 'Feide-id' }, { name: 'Test', value: 'test' }]}
                  onChange={(s: string) => setPollbookFilter(s)}
                  value='hei'

                />
              </TableCell>
            </TableRow>

            <Query
              query={voterSearchQuery}
              variables={{
                electionGroupId: electionGroup.id,
                limit: 50,
                search: searchString,
              }}

            >
              {({ data, loading, error, refetch }) => {

                if (loading) {
                  return (
                    <TableRow>
                      <TableCell>
                        <Spinner size="2.2rem" darkStyle ></Spinner>
                        Testing..
                    </TableCell>
                    </TableRow>
                  )
                }

                console.info(data.searchVoters)

                const voters: Array<IVoter> = data.searchVoters

                if (voters.length === 0 && searchString !== '') {
                  return (
                    <TableRow>
                      <TableCell>
                        <span>No voters matching {searchString}</span>

                      </TableCell>
                    </TableRow>
                  )
                }

                return (
                  <>
                    {voters.map(voter => {
                      return (
                        <React.Fragment key={voter.id}>
                          <TableRow>
                            <TableCell>{voter.idType}</TableCell>
                            <TableCell>{voter.idValue}</TableCell>
                            <TableCell>{voter.pollbook.name[i18n.language]}</TableCell>
                            <TableCell>{voter.hasVoted ? 'Ja' : 'Nei'}</TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}

                  </>
                )

              }}

            </Query>
          </TableBody>
        </Table>
      </PageSection>
    </>
  )
}

export default CensusSearchTable;