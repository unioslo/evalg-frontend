import { ApolloClient } from 'apollo-client';
import arrayMutators from 'final-form-arrays'
import gql from 'graphql-tag';
import throttle from 'lodash/throttle';
import * as React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Trans, translate } from 'react-i18next';
import injectSheet from 'react-jss';

import ActionText from 'components/actiontext';
import { FormButtons } from 'components/form';
import AutoCompleteDropDown from '../../components/AutoCompleteDropDown';

const styles = (theme: any) => ({
  item: {
    alignItems: 'center',
    display: 'flex',
    marginBottom: '1rem',
    marginTop: '1rem'
  },
  itemName: {
    marginRight: '1rem',
  }
});

const searchPersonsQuery = gql`
  query searchPersons($val: String!) {
    searchPersons(val: $val) {
      id
      firstName
      lastName
    }
  }
`;

interface IProps {
  closeAction: () => void,
  submitAction: (values: any) => void,
  deletePollbookAction: () => void,
  initialValues: any,
  pollbook: IPollBook,
  i18n: any,
  classes: any
}

interface Istate {
  persons: IPerson[],
  personFilter: string,
  pollbook: IPollBook,
  showPersons: IPerson[],
}

interface IPersonQueryResult {
  searchPersons: IPerson[]
}

class AddVoter extends React.Component<IProps, Istate> {

  public handlePersonSearch = throttle(async (client: ApolloClient<any>, value: string) => {
    const searchedPersons = await this.searchPersons(client, value);
    const { persons } = this.state;
    // We don't want to list persons that are already added
    // in the search results.

    const newPersons = searchedPersons.filter((p: IPerson) => {
      for (const e of persons) {
        if (p.id === e.id) {
          return false;
        }
      }
      return true;
    })
    this.setState({ showPersons: newPersons });
  })

  constructor(props: IProps) {
    super(props);
    this.state = {
      personFilter: '',
      persons: [],
      pollbook: props.pollbook,
      showPersons: [],
    }
    this.handlePersonFilterUpdate = this.handlePersonFilterUpdate.bind(this)
    this.theForm = this.theForm.bind(this);
  }


  public async searchPersons(client: ApolloClient<any>, name: string) {
    const { data } = await client.query<IPersonQueryResult>({
      query: searchPersonsQuery,
      variables: { val: name }
    });
    return data.searchPersons;
  }

  public handlePersonFilterUpdate(client: ApolloClient<any>, value: string) {
    this.setState({ personFilter: value });
    if (value.length > 1) {
      this.handlePersonSearch(client, value);
    }
  }

  public render() {
    const {
      initialValues,
    } = this.props;

    return (
      <Form
        onSubmit={this.props.submitAction}
        mutators={{ ...arrayMutators }}
        initialValues={initialValues}
        render={this.theForm}
      />
    )
  }

  private theForm(formProps: any) {
    const { pristine, valid, handleSubmit, values } = formProps;
    const {
      closeAction,
      deletePollbookAction,
      i18n: { language: lang },
      classes
    } = this.props;

    const renderPerson = (obj: IPerson) => [obj.firstName, obj.lastName].join(' ');
    return (
      <ApolloConsumer>
        {client => {
          return (
            <form onSubmit={handleSubmit}>
              <b>
                <Trans values={{ pollbookName: this.state.pollbook.name[lang] }}>
                  census.addPersons
                </Trans>
              </b>
              <FieldArray name="persons">
                {({ fields }) => {
                  const addPerson = (person: IPerson) => {
                    fields.push(person);
                    this.setState({persons: [...this.state.persons, ...[person]]})
                  }
                  const removePerson = (index: number) => {
                    this.setState({persons: [...this.state.persons.slice(0,index), ...this.state.persons.slice(index + 1)]})
                    fields.remove(index);
                  }
                  return (
                    <div>
                      {fields.map((name, index) => (
                        <div key={index}>

                          {values && values.persons && values.persons[index] ?
                            <>

                              <div className={classes.item}>
                                <div className={classes.itemName}>
                                  {renderPerson(values.persons[index])}
                                </div>

                                <ActionText action={removePerson.bind(this, index)}>
                                  <Trans>general.remove</Trans>
                                </ActionText>

                              </div>
                            </>
                            : null
                          }

                        </div>
                      ))}
                      <AutoCompleteDropDown
                        objects={this.state.showPersons}
                        userInput={this.state.personFilter}
                        onChange={this.handlePersonFilterUpdate.bind(self, client)}
                        buttonAction={addPerson}
                        buttonText={<Trans>general.add</Trans>}
                        objRenderer={renderPerson}
                      />
                      <FormButtons
                        saveAction={handleSubmit}
                        closeAction={closeAction}
                        submitDisabled={pristine || !valid}
                        entityAction={deletePollbookAction}
                        entityText={<Trans>census.deleteCensus</Trans>}
                      />
                    </div>
                  )
                }}
              </FieldArray>
            </form>
          )
        }}
      </ApolloConsumer>
    )
  }
}

export default injectSheet(styles)(translate()(AddVoter));