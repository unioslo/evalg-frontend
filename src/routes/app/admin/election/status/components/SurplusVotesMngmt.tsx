import React from 'react';
import { WithApolloClient, withApollo } from 'react-apollo';
import {
  Trans,
  WithTranslation,
  withTranslation,
} from 'react-i18next';
import { PageExpandableSubSection } from 'components/page/PageSection';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from 'components/table';
import { Form, Field, FormRenderProps } from 'react-final-form';
import { FormField, RadioButtonGroup } from 'components/form';
import { IPerson, IVoter } from 'interfaces';
import injectSheet from 'react-jss';
import Button from 'components/button';
import { Classes } from 'jss';
import Spinner from 'components/animations/Spinner';
import { reviewVoter } from 'mutations';
import { refetchVoteManagementQueries } from 'queries';
import Icon from 'components/icon';

const styles = (theme: any) => ({
  voteSelectForm: {
    display: 'flex',
    alignItems: 'center',
  },
  radioButton: {
    paddingTop: '1.5rem',
    flex: '2',
  },
  buttonContainer: {
    flex: '1',
    display: 'contents',
    alignItems: 'center',
  },
  spinnerContainer: {
    width: '2.5rem',
    marginLeft: '0rem',
  },
  descriptionContainer: {
    alignItems: 'center',
    display: 'flex',
  },
  iconContainer: {
    marginLeft: '0.5rem',
  },
});

interface IPersonWithVoters {
  person: IPerson;
  voters: IVoter[];
}

interface IReviewVoterResponse {
  ok: boolean;
}

interface IProps extends WithTranslation {
  electionGroupId: string;
  personsWithMultipleVerifiedVoters: any;
  classes: Classes;
}

interface IState {
  isUploading: boolean;
}

type PropsInternal = WithApolloClient<IProps>;

class SurplusVotesMngmt extends React.Component<PropsInternal, IState> {
  constructor(props: PropsInternal) {
    super(props);

    this.state = {
      isUploading: false,
    };
  }

  public rejectVote = (voterId: string) => {
    const mutationVars = {
      mutation: reviewVoter,
      variables: {
        id: voterId,
        verify: false,
      },
      refetchQueries: refetchVoteManagementQueries,
      awaitRefetchQueries: true,
    };
    return this.props.client.mutate(mutationVars);
  };

  public getOnSubmit = (voters: IVoter[]) => async (value: any) => {
    this.setState({ isUploading: true });
    const votersToReject = voters.filter(voter => voter.id !== value.voterId);
    const promises = votersToReject.map((voter: IVoter) =>
      this.rejectVote(voter.id)
    );
    await Promise.all(promises);
    this.setState({ isUploading: false });
  };

  public getOptions = (voters: IVoter[]) =>
    voters.map(voter => ({
      label: voter.pollbook.name[this.props.i18n.language],
      value: voter.id,
      id: voter.id,
    }));

  public getRenderForm = (person: IPerson, voters: IVoter[]) => (
    formRenderProps: FormRenderProps
  ) => {
    const { handleSubmit, pristine, invalid } = formRenderProps;
    return (
      <TableBody>
        <TableRow>
          <TableCell>{person.displayName}</TableCell>
          <TableCell>
            <form
              onSubmit={(event: React.SyntheticEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleSubmit(event);
              }}
            >
              <div className={this.props.classes.voteSelectForm}>
                <div className={this.props.classes.radioButton}>
                  <FormField>
                    <Field
                      name="voterId"
                      component={RadioButtonGroup as any}
                      validate={(value: any) =>
                        value ? undefined : 'Required'
                      }
                      options={this.getOptions(voters)}
                    />
                  </FormField>
                </div>
                <div className={this.props.classes.buttonContainer}>
                  <Button
                    text={this.props.t(`admin.manageSurplusVoters.confirm`)}
                    disabled={pristine || invalid || this.state.isUploading}
                    type="submit"
                  />
                  <div className={this.props.classes.spinnerContainer}>
                    {this.state.isUploading && (
                      <Spinner darkStyle marginLeft="1.4rem" size="2.2rem" />
                    )}
                  </div>
                </div>
              </div>
            </form>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  };

  public render() {
    if (this.props.personsWithMultipleVerifiedVoters.error) {
      return <p>'Error!'</p>;
    }

    if (this.props.personsWithMultipleVerifiedVoters.loading) {
      return <Spinner darkStyle/>;
    }

    const personsWithMultipleVerifiedVoters = this.props
      .personsWithMultipleVerifiedVoters.data
      .personsWithMultipleVerifiedVoters as IPersonWithVoters[];

    return personsWithMultipleVerifiedVoters.length === 0 ? (
      <div className={this.props.classes.descriptionContainer}>
        <span>
          <Trans>admin.manageSurplusVoters.descriptionNoPersons</Trans>
        </span>
        <div className={this.props.classes.iconContainer}>
          <Icon type="checkMark" />
        </div>
      </div>
    ) : (
      <>
        <Trans>admin.manageSurplusVoters.description</Trans>
        <PageExpandableSubSection
          header={`${this.props.t(`admin.manageSurplusVoters.dropdown`)} (${
            personsWithMultipleVerifiedVoters.length
          })`}
        >
          <Table marginTop="3rem">
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell width="31%">
                  <Trans>admin.manageSurplusVoters.person</Trans>
                </TableHeaderCell>
                <TableHeaderCell width="69%">
                  <Trans>election.voterGroup</Trans>
                </TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            {personsWithMultipleVerifiedVoters.map(({ person, voters }) => (
              <Form
                key={person.id}
                onSubmit={this.getOnSubmit(voters)}
                render={this.getRenderForm(person, voters)}
              />
            ))}
          </Table>
        </PageExpandableSubSection>
      </>
    );
  }
}

export default injectSheet(styles)(
  withTranslation()(withApollo(SurplusVotesMngmt))
);
