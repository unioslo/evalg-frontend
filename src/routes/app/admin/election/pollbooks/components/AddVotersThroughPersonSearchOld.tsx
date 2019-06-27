import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import throttle from 'lodash/throttle';
import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { WithTranslation, withTranslation } from 'react-i18next';
import injectSheet from 'react-jss';

import ActionText from '../../../../../../components/actiontext';
import { FormButtons } from '../../../../../../components/form';
import AutoCompleteDropDown from '../../components/AutoCompleteDropDown';

import { IVoter, IPollBook, IPerson } from '../../../../../../interfaces';

const styles = (theme: any) => ({
  item: {
    alignItems: 'center',
    display: 'flex',
    marginBottom: '1rem',
    marginTop: '1rem',
  },
  itemName: {
    marginRight: '1rem',
  },
});

const searchPersonQuery = gql`
  query searchPerson($val: String!) {
    searchPerson(val: $val) {
      id
      displayName
    }
  }
`;

interface IProps extends WithTranslation {
  closeAction: () => void;
  submitAction: (values: any) => void;
  deletePollbookAction: () => void;
  registeredVoters: IVoter[];
  initialValues?: any;
  pollbook: IPollBook;
  classes: any;
}

interface Istate {
  personsAlreadyInPollbook: any[];
  newPersonsToAddList: IPerson[];
  addablePersonsFromSearch: IPerson[];
  personFilter: string;
  pollbook: any;
}

interface IPersonQueryResult {
  searchPerson: IPerson[];
}

class AddVoter extends React.Component<IProps, Istate> {
  handlePersonSearch = throttle(
    async (client: ApolloClient<any>, value: string) => {
      const searchResultPersons = await this.searchPersons(client, value);
      const { personsAlreadyInPollbook, newPersonsToAddList } = this.state;
      // We don't want to list persons that are already added
      // in the search results.

      const removePersons = personsAlreadyInPollbook.concat(
        newPersonsToAddList
      );

      const addablePersonsFromSearch = searchResultPersons.filter(
        (searchPerson: IPerson) => {
          for (const removePerson of removePersons) {
            if (searchPerson.id === removePerson.id) {
              return false;
            }
          }
          return true;
        }
      );
      this.setState({ addablePersonsFromSearch });
    },
    50
  );

  constructor(props: IProps) {
    super(props);
    const { registeredVoters } = this.props;

    this.state = {
      personFilter: '',
      personsAlreadyInPollbook: registeredVoters.map(voter => ({
        id: '',
        displayName: voter.idValue,
        nin: '',
      })),
      newPersonsToAddList: [],
      addablePersonsFromSearch: [],
      pollbook: props.pollbook,
    };
    this.handlePersonFilterUpdate = this.handlePersonFilterUpdate.bind(this);
  }

  async searchPersons(client: ApolloClient<any>, name: string) {
    const { data } = await client.query<IPersonQueryResult>({
      query: searchPersonQuery,
      variables: { val: name },
    });
    return data.searchPerson;
  }

  handlePersonFilterUpdate(client: ApolloClient<any>, value: string) {
    this.setState({ personFilter: value });
    if (value.length > 1) {
      this.handlePersonSearch(client, value);
    }
  }

  addPersonToAddList = (person: IPerson) => {
    this.setState(currState => ({
      newPersonsToAddList: [...currState.newPersonsToAddList, person],
    }));
  };

  removePersonFromAddList = (index: number) => {
    this.setState({
      newPersonsToAddList: [
        ...this.state.newPersonsToAddList.slice(0, index),
        ...this.state.newPersonsToAddList.slice(index + 1),
      ],
    });
  };

  submitNewPersons = () => {
    this.props.submitAction(this.state.newPersonsToAddList);
    this.setState({
      newPersonsToAddList: [],
    });
  };

  render() {
    const { closeAction, deletePollbookAction, classes, i18n, t } = this.props;
    const lang = i18n.language;

    const renderPerson = (p: IPerson) => p.displayName;

    return (
      <>
        <strong>
          {t('census.addPersonsInPollbook', {
            pollbookName: this.state.pollbook.name[lang],
          })}
        </strong>
        {this.state.newPersonsToAddList.map((person, index) => (
          <div key={person.id} className={classes.item}>
            <div className={classes.itemName}>{renderPerson(person)}</div>
            <ActionText action={() => this.removePersonFromAddList(index)}>
              {t('general.remove')}
            </ActionText>
          </div>
        ))}
        <ApolloConsumer>
          {client => (
            <AutoCompleteDropDown
              objects={this.state.addablePersonsFromSearch}
              userInput={this.state.personFilter}
              onChange={this.handlePersonFilterUpdate.bind(self, client)}
              buttonAction={this.addPersonToAddList}
              buttonText={t('general.add')}
              objRenderer={renderPerson}
            />
          )}
        </ApolloConsumer>
        <FormButtons
          saveAction={this.submitNewPersons}
          closeAction={closeAction}
          submitDisabled={this.state.newPersonsToAddList.length === 0}
          entityAction={deletePollbookAction}
          entityText={t('census.deleteCensus')}
        />
      </>
    );
  }
}

export default injectSheet(styles)(withTranslation()(AddVoter));
