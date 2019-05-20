import React from 'react';
import { Trans } from 'react-i18next';
import throttle from 'lodash/throttle';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import { PageSubSection } from '../../../../../../components/page';
import Text from '../../../../../../components/text';
import { Button, ButtonContainer } from '../../../../../../components/button';
import AutoCompleteDropDown from '../../components/AutoCompleteDropDown';
import {
  IPersonSearchResult,
  IGroupSearchResult,
} from '../../../../../../interfaces';
import { IAdminGrant } from './AdminRolesSettings';

const styles = (theme: any) => ({
  form: {
    display: 'flex',
  },
  formSection: {
    marginTop: '3rem',
    display: 'inline-block',
    marginRight: '8rem',
  },
  list: {
    display: 'inline-block',
    listStyleType: 'none',
    marginTop: '1rem',
  },
  removeButton: {
    background: 'url("/remove.svg") no-repeat right top 30%',
    backgroundSize: '1.4rem',
    height: '1.4rem',
    width: '1.4rem',
    paddingRight: '2.5rem',
    display: 'inline-block',
    '&:hover': {
      cursor: 'pointer',
    },
  },
});

interface IProps {
  classes: Classes;
  closeAction: () => void;
  adminPersons: IAdminGrant[];
  adminGroups: IAdminGrant[];
  searchPersons: (value: string) => Promise<IPersonSearchResult[]>;
  searchGroups: (value: string) => Promise<IGroupSearchResult[]>;
  addAction: (principalOwner: string, principalType: string) => void;
  removeAction: (grantId: string) => void;
}

interface IState {
  adminPersonFilter: string;
  adminGroupFilter: string;
  personMatches: IPersonSearchResult[];
  groupMatches: IGroupSearchResult[];
}

class AdminRolesForm extends React.Component<IProps, IState> {
  handlePersonSearch: (value: string) => Promise<void>;
  handleGroupSearch: (value: string) => Promise<void>;

  constructor(props: IProps) {
    super(props);
    this.state = {
      adminPersonFilter: '',
      adminGroupFilter: '',
      personMatches: [],
      groupMatches: [],
    };
    this.handlePersonSearch = throttle(async value => {
      const persons = await this.props.searchPersons(value);
      const { adminPersons } = this.props;
      // We don't want to list persons that are already set as admins
      // in the search results.
      const newPersons = persons.filter(p => {
        for (let i = 0; i < adminPersons.length; i++) {
          if (p.id === adminPersons[i].id) {
            return false;
          }
        }
        return true;
      });
      this.setState({ personMatches: newPersons });
    });
    this.handleGroupSearch = throttle(async value => {
      const groups = await this.props.searchGroups(value);
      const { adminGroups } = this.props;
      // We don't want to list groups that are already set as admins
      // in the search results.
      const newGroups = groups.filter(p => {
        for (let i = 0; i < adminGroups.length; i++) {
          if (p.id === adminGroups[i].id) {
            return false;
          }
        }
        return true;
      });
      this.setState({ groupMatches: newGroups });
    });
  }

  handleAdminPersonFilterUpdate(value: string) {
    this.setState({ adminPersonFilter: value });
    if (value.length > 1) {
      this.handlePersonSearch(value);
    }
  }

  handleAdminGroupFilterUpdate(value: string) {
    this.setState({ adminGroupFilter: value });
    if (value.length > 1) {
      this.handleGroupSearch(value);
    }
  }
  render() {
    const {
      closeAction,
      classes,
      addAction,
      removeAction,
      adminPersons,
      adminGroups,
    } = this.props;
    const {
      // adminPersonFilter,
      adminGroupFilter,
    } = this.state;
    return (
      <div>
        <PageSubSection header={<Trans>election.electionAdmins</Trans>}>
          <Text>
            <Trans>election.electionAdminsDesc</Trans>
          </Text>
          <div className={classes.form}>
            <div className={classes.formSection}>
              <Text bold>
                <Trans>election.adminUser</Trans>
              </Text>
              <ul className={classes.list}>
                {adminPersons.map((person, index) => (
                  <li key={index}>
                    <Text inline>{person.name}</Text>
                    <div
                      className={classes.removeButton}
                      onClick={() => removeAction(adminPersons[index].grantId)}
                    />
                  </li>
                ))}
              </ul>
              <AutoCompleteDropDown
                objects={this.state.personMatches}
                userInput={this.state.adminPersonFilter}
                onChange={this.handleAdminPersonFilterUpdate.bind(this)}
                buttonAction={(person: IAdminGrant) =>
                  addAction(person.id, 'person')
                }
                buttonText={<Trans>general.add</Trans>}
                objRenderer={(person: IAdminGrant) => person.name}
              />
            </div>
            <div className={classes.formSection}>
              <Text bold>
                <Trans>election.adminGroup</Trans>
              </Text>
              <ul className={classes.list}>
                {adminGroups.map((group, index) => (
                  <li key={index}>
                    <Text inline>{group.name}</Text>
                    <div
                      className={classes.removeButton}
                      onClick={() => removeAction(adminGroups[index].grantId)}
                    />
                  </li>
                ))}
              </ul>
              <AutoCompleteDropDown
                objects={[]}
                userInput={adminGroupFilter}
                onChange={this.handleAdminGroupFilterUpdate.bind(this)}
                buttonAction={(group: IAdminGrant) =>
                  addAction(group.id, 'group')
                }
                buttonText={<Trans>general.add</Trans>}
                objRenderer={(group: IAdminGrant) => group.name}
              />
            </div>
          </div>
        </PageSubSection>
        <ButtonContainer>
          <Button text="Lukk" action={closeAction} />
        </ButtonContainer>
      </div>
    );
  }
}

export default injectSheet(styles)(AdminRolesForm);
