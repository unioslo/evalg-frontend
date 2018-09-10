import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';

import ActionText from 'components/actiontext';
import {
  ActionButton, ElectionButton, ElectionButtonContainer
} from 'components/button';
import { Page, PageSection } from 'components/page';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableRow
} from 'components/table';
import Text from 'components/text';
import { Trans, translate } from 'react-i18next';

// import AddPersonModal from './components/AddPersonModal';

const electionGroupQuery = gql`
  query electionGroupVoters($id: UUID!) {
    electionGroup(id: $id) {
      id
      name
      description
      type
      candidateType
      mandateType
      meta
      ouId
      publicKey
      announcedAt
      publishedAt
      cancelledAt
      deletedAt
      status
      cancelled
      announced
      published
      deleted
      elections {
        id
        name
        description
        type
        candidateType
        mandateType
        meta
        sequence
        start
        end
        informationUrl
        contact
        mandatePeriodStart
        mandatePeriodEnd
        groupId
        active
        status
        publishedAt
        cancelledAt
        lists {
          id
          name
          description
          informationUrl
          candidates {
            id
            name
            meta
            informationUrl
            priority
            preCumulated
            userCumulated
            listId
          }
        }
        pollbooks {
          id
          name
          weight
          priority
          voters {
            id
            pollbookId
            person {
              id
              firstName
              lastName
              nin
            }
          }
        }
      }
    }
  }
`;


interface IProps {
  t: (t: string) => string,
  i18n: any,
  groupId: string
};


interface IState {
  pollBookId: string,
  voterId: string
};

class ElectionGroupCensuses extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      pollBookId: '',
      voterId: ''
    }
  }

  public render() {
    const { t, i18n: { language: lang } } = this.props;
    return (
      <Query
        query={electionGroupQuery}
        variables={{ id: this.props.groupId }}>
        {({ data, loading, error }) => {
          if (loading || error) {
            return null;
          }
          const elections: Election[] = data.electionGroup.elections;
          const voters: IVoter[] = [];
          const pollBookDict = {};
          elections.forEach((el: Election) => {
            el.pollbooks.forEach(pollBook => {
              pollBookDict[pollBook.id] = pollBook
              pollBook.voters.forEach(voter => {
                voters.push(voter);
              })
            });
          });
          const pollbookButtons: JSX.Element[] = []
          elections.forEach((e, index) => {
            e.pollbooks.forEach((pollbook, i) => {
              pollbookButtons.push(
                <ElectionButton hoverText={<Trans>census.addPerson</Trans>}
                  name={pollbook.name[lang]}
                  key={`${index}${i}`}
                  count={0}
                  minCount={false}
                  action={this.showNewVoterForm.bind(pollbook.id)}
                />
              )
            })
          })
          return (
            <Page header={<Trans>election.censuses</Trans>}>
              <PageSection noBorder={true} desc={<Trans>census.censusPageDesc</Trans>}>
                <ActionButton text={t('census.uploadCensusFile')} />
              </PageSection>
              <PageSection header={<Trans>election.census</Trans>} noBorder={true}>
                <ElectionButtonContainer>
                  {pollbookButtons}
                </ElectionButtonContainer>
                {/* this.state.pollBookId &&
                  <AddPersonModal
                    closeAction={this.closeUpdateVoterForm}
                    pollbook={filteredPollbooks[activePollbook]}
                  />
                 */}
                <Table>
                  <TableHeader>
                    <TableHeaderRow>
                      <TableHeaderCell>
                        <Trans>census.person</Trans>
                      </TableHeaderCell>
                      <TableHeaderCell>
                        <Trans>census.group</Trans>
                      </TableHeaderCell>
                      <TableHeaderCell />
                    </TableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {voters.map((v, index) => (
                      <TableRow key={index} actionTextOnHover={true}>
                        <TableCell>
                          <Text>
                            {v.person.firstName + ' ' + v.person.lastName}
                          </Text>
                        </TableCell>
                        <TableCell>
                          <Text>
                            {pollBookDict[v.pollbookId].name[lang]}
                          </Text>
                        </TableCell>
                        <TableCell alignRight={true}>
                          <Text>
                            <ActionText
                              action={this.showUpdateVoterForm.bind(v.id)}>
                              <Trans>general.edit</Trans>
                            </ActionText>
                          </Text>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </PageSection>
            </Page>
          )
        }}
      </Query>
    )

  }

  private showNewVoterForm(pollBookId: string) {
    this.setState({ pollBookId, voterId: '' })
  }

  // private closeNewVoterForm() {
  //   this.setState({ pollBookId: '' });
  // }

  private showUpdateVoterForm(voterId: string) {
    this.setState({ pollBookId: '', voterId })
  }

  // private closeUpdateVoterForm() {
  //   this.setState({ voterId: '' })
  // }
}

export default translate()(ElectionGroupCensuses);
