import gql from 'graphql-tag';
import * as React from 'react';
import { Mutation } from 'react-apollo';

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

import AddPersonModal from './components/AddPersonModal';



const electionGroupQuery = gql`
  query electionGroup($id: UUID!) {
    electionGroup(id: $id) {
      id
      name
      description
      type
      candidateType
      mandateType
      meta
      elections {
        id
        name
        description
        type
        candidateType
        mandateType
        meta
        sequence
        mandatePeriodStart
        mandatePeriodEnd
        active
        pollbooks {
          id
          name
          weight
          priority
          voters {
            id
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
  i18n: reactI18Next.I18n
};


interface IState {
  addPersonModalActive: boolean,
  activePollbook: number,
};

class ElectionGroupCensuses extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activePollbook: -1,
      addPersonModalActive: false,
    }
  }

  render() {
    const { t, electionGroup } = this.props;
    const { addPersonModalActive, activePollbook } = this.state;

    const filteredPollbooks = [];
    elections.forEach(el => {
      el.pollbooks.forEach(pollbookId => {
        filteredPollbooks.push(pollbooks[pollbookId]);
      });
    });

    return (
      <Page header={<Trans>election.censuses</Trans>}>
        <PageSection noBorder desc={<Trans>census.censusPageDesc</Trans>}>
          <ActionButton text={t('census.uploadCensusFile')} />
        </PageSection>
        <PageSection header={<Trans>election.census</Trans>}
          noBorder>
          <ElectionButtonContainer>
            {filteredPollbooks.map((pollbook, index) => {
              return (
                <ElectionButton hoverText={<Trans>census.addPerson</Trans>}
                  name={pollbook.name[lang]}
                  key={index}
                  count={0}
                  minCount={1}
                  action={() => this.setState({
                    addPersonModalActive: true,
                    activePollbook: index
                  })}
                />
              )
            })}
          </ElectionButtonContainer>
          {// Modal for adding person
          }
          {addPersonModalActive === true &&
            <AddPersonModal closeAction={() => this.setState({ addPersonModalActive: false })}
              pollbook={filteredPollbooks[activePollbook]}
            />
          }
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>
                  <Trans>census.person</Trans>
                </TableHeaderCell>
                <TableHeaderCell>
                  <Trans>census.group</Trans>
                </TableHeaderCell>
                <TableHeaderCell>
                </TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {objPropsToArray(voters).map((voter, index) => {
                const person = this.voterToPerson(voter, persons)
                // We cant display if the persons arent loaded yet
                if (person) {
                  return (
                    <TableRow key={index} actionTextOnHover>
                      <TableCell>
                        <Text>
                          {person.firstName + ' ' + person.lastName}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Text>
                          {pollbooks[voter.pollbookId].name[lang]}
                        </Text>
                      </TableCell>
                      <TableCell alignRight>
                        <Text>
                          <ActionText action={
                            () => console.error("edit")}>
                            <Trans>general.edit</Trans>
                          </ActionText>
                        </Text>
                      </TableCell>
                    </TableRow>
                  )
                }
                return null;
              })}
            </TableBody>
          </Table>
        </PageSection>
      </Page>
    )
  }
}

export default translate()(ElectionGroupCensuses);
