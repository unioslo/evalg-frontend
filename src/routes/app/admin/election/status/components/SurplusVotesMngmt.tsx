import React, { useState } from 'react';
import { Query, WithApolloClient, withApollo } from 'react-apollo';
import { Trans, useTranslation } from 'react-i18next';
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
import { refetchVoteManagementQueries, personsWithMultipleVerifiedVotersQuery } from 'queries';
import Icon from 'components/icon/index';

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

interface IProps {
  electionGroupId: string;
  classes: Classes;
}

type PropsInternal = WithApolloClient<IProps>;

const SurplusVotesMngmt: React.FunctionComponent<PropsInternal> = props => {
  const { t, i18n } = useTranslation();

  const [isUploading, setIsUploading] = useState(false);

  const rejectVote = (voterId: string, isLastQuery: boolean) => {
    const mutationVars = {
      mutation: reviewVoter,
      variables: {
        id: voterId,
        verify: false,
      },
      refetchQueries: refetchVoteManagementQueries,
      awaitRefetchQueries: true,
    };

    return props.client.mutate(mutationVars);
  };

  const getOnSubmit = (voters: IVoter[]) =>
    async function(value: any) {
      setIsUploading(true);
      const votersToReject = voters.filter(voter => voter.id != value.voterId);
      const lastElement = votersToReject[votersToReject.length - 1];
      const promises = votersToReject.map((voter: IVoter) =>
        rejectVote(voter.id, voter === lastElement)
      );
      await Promise.all(promises);
      setIsUploading(false);
    };

  const getOptions = (voters: IVoter[]) =>
    voters.map(voter => ({
      label: voter.pollbook.name[i18n.language],
      value: voter.id,
      id: voter.id,
    }));

  const getRenderForm = (person: IPerson, voters: IVoter[]) => (
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
              <div className={props.classes.voteSelectForm}>
                <div className={props.classes.radioButton}>
                  <FormField>
                    <Field
                      name="voterId"
                      component={RadioButtonGroup as any}
                      validate={(value: any) =>
                        value ? undefined : 'Required'
                      }
                      options={getOptions(voters)}
                    />
                  </FormField>
                </div>
                <div className={props.classes.buttonContainer}>
                  <Button
                    text={t(`admin.manageSurplusVoters.confirm`)}
                    disabled={pristine || invalid || isUploading}
                    type="submit"
                  />
                  <div className={props.classes.spinnerContainer}>
                    {isUploading && (
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

  return (
    <Query
      query={personsWithMultipleVerifiedVotersQuery}
      variables={{ id: props.electionGroupId }}
      key={props.electionGroupId}
      fetchPolicy="network-only"
    >
      {({ data, loading, error }) => {
        if (error) {
          return 'Error!';
        }

        if (loading) {
          return 'Loading!';
        }
        const personsWithMultipleVerifiedVoters = data.personsWithMultipleVerifiedVoters as IPersonWithVoters[];

        return personsWithMultipleVerifiedVoters.length === 0 ? (
          <div className={props.classes.descriptionContainer}>
            <span>
              <Trans>admin.manageSurplusVoters.descriptionNoPersons</Trans>
            </span>
            <div className={props.classes.iconContainer}>
              <Icon type="checkMark" />
            </div>
          </div>
        ) : (
          <>
            <Trans>admin.manageSurplusVoters.description</Trans>
            <PageExpandableSubSection
              header={`${t(`admin.manageSurplusVoters.dropdown`)} (${
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
                    onSubmit={getOnSubmit(voters)}
                    render={getRenderForm(person, voters)}
                  />
                ))}
              </Table>
            </PageExpandableSubSection>
          </>
        );
      }}
    </Query>
  );
};

export default injectSheet(styles)(withApollo(SurplusVotesMngmt));
