import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import Loading from 'components/loading';
import Link from 'components/link';
import { Page, PageSection } from 'components/page';
import { DropDown } from 'components/form';
import Button, { ButtonContainer } from 'components/button';
import { translate, Trans } from 'react-i18next';
import { withRouter } from 'react-router';
import injectSheet from 'react-jss';
import Icon from 'components/icon';
import { ApolloClient } from 'apollo-boost';
import MandatePeriodText from '../vote/components/MandatePeriodText';

const styles = (theme: any) => ({
  ingress: theme.ingressText,
  subheading: {
    fontSize: '2.6rem',
    lineHeight: '2.7rem',
    marginBottom: '1.8rem',
  },
  electionGroupInfoSection: {
    marginBottom: '6rem',
  },
  votingRightsSection: {},
  notInVotingGroupReasonTextArea: {
    width: '100%',
    padding: 10,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    border: theme.formFieldBorder,
    borderColor: theme.formFieldBorderColor,
    borderRadius: theme.formFieldBorderRadius,
  },
  notInVotingGroupParagraph: {
    marginTop: '2.2rem',
    marginBottom: '2rem',
  },
  aboutElectionLink: {
    fontSize: '1.8rem',
    marginTop: '1.8rem',
  },
  aboutElectionLinkIcon: {
    position: 'relative',
    top: '-1px',
  },
  aboutElectionLinkText: {
    paddingRight: '1.1rem',
  },
  beforeDropdownText: {
    paddingRight: '0.8rem',
  },
});

const getElectionGroupData = gql`
  query ElectionGroupData($id: UUID!) {
    electionGroup(id: $id) {
      id
      name
      description
      elections {
        id
        name
        mandatePeriodStart
        mandatePeriodEnd
        informationUrl
        lists {
          id
          name
        }
      }
    }
  }
`;

interface IProps {
  electionGroupId: string;
  i18n: any;
  history: any;
  match: any;
  location: any;
  t: any;
  classes: any;
}

interface IState {
  selectedVotingGroupIndex: number;
  notInVotingGroupReason: string;
}

class VotingGroupSelectPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedVotingGroupIndex: 0,
      notInVotingGroupReason: '',
    };
    this.handleSelectVotingGroup = this.handleSelectVotingGroup.bind(this);
    this.handleNotInVotingGroupReasonChange = this.handleNotInVotingGroupReasonChange.bind(
      this
    );
    this.handleProceed = this.handleProceed.bind(this);
  }

  public hasVotingRights(selectedGroupIndex: number): boolean {
    // Dummy implementation. TODO: Check for which group an actual logged in user has voting rights.
    return selectedGroupIndex === 0;
  }

  public handleSelectVotingGroup(selectedVotingGroupIndex: number) {
    this.setState({ selectedVotingGroupIndex });
  }

  public handleNotInVotingGroupReasonChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    this.setState({ notInVotingGroupReason: event.target.value });
  }

  public handleProceed(
    proceedToLink: string,
    apolloClient: ApolloClient<any>,
    notInVotingGroupReason: string
  ) {
    if (
      !this.hasVotingRights(this.state.selectedVotingGroupIndex) &&
      notInVotingGroupReason
    ) {
      // Write "notInVotingGroupReason" to local cache, to send with vote later.
      apolloClient.writeData({ data: { notInVotingGroupReason } });
    }
    this.props.history.push(proceedToLink);
  }

  public render() {
    const lang = this.props.i18n.language;
    const history = this.props.history;
    const classes = this.props.classes;
    const t = this.props.t;

    return (
      <Query
        query={getElectionGroupData}
        variables={{ id: this.props.electionGroupId }}
      >
        {({ data, loading, error, client }) => {
          if (loading) {
            return <Loading />;
          }
          if (error) {
            return 'Error';
          }

          const electionGroup: ElectionGroup = data.electionGroup;
          const electionGroupName = electionGroup.name;
          const elections: Election[] = electionGroup.elections;
          const proceedToLink = `/voter/elections/${
            elections[this.state.selectedVotingGroupIndex].id
          }/vote`;

          const dropdown = (
            <DropDown
              options={elections.map((election, index) => ({
                value: index,
                name: election.lists[0].name[lang],
                secondaryLine: this.hasVotingRights(index)
                  ? 'Stemmerett'
                  : null,
              }))}
              value={this.state.selectedVotingGroupIndex}
              onChange={this.handleSelectVotingGroup}
              inline={true}
            />
          );

          return (
            <Page header={electionGroupName[lang]}>
              <PageSection noBorder={true}>
                <div className={classes.electionGroupInfoSection}>
                  <p className={classes.ingress}>
                    <MandatePeriodText election={elections[0]} />
                  </p>
                  {elections[0].informationUrl && (
                    <div className={classes.aboutElectionLink}>
                      <Link
                        to={elections[0].informationUrl}
                        marginRight={true}
                        external={true}
                      >
                        <span className={classes.aboutElectionLinkText}>
                          <Trans>
                            voterVotingGroupSelect.aboutElectionLink
                          </Trans>
                        </span>
                        <div className={classes.aboutElectionLinkIcon}>
                          <Icon type="externalLink" />
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
                <div className="votingRightsSection">
                  {this.hasVotingRights(this.state.selectedVotingGroupIndex) ? (
                    <>
                      <p className={classes.subheading}>
                        <Trans>
                          voterVotingGroupSelect.registeredInSelectedGroupHeading
                        </Trans>
                      </p>
                      <div className={classes.ingress}>
                        <span className={classes.beforeDropdownText}>
                          <Trans>
                            voterVotingGroupSelect.registeredInSelectedGroupBeforeDropdownText
                          </Trans>
                        </span>
                        {dropdown}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className={classes.subheading}>
                        <Trans>
                          voterVotingGroupSelect.notRegisteredInSelectedGroupHeading
                        </Trans>
                      </p>
                      <div className={classes.ingress}>
                        <span className={classes.beforeDropdownText}>
                          <Trans>
                            voterVotingGroupSelect.notRegisteredInSelectedGroupBeforeDropdownText
                          </Trans>
                        </span>
                        {dropdown}
                      </div>
                      <p className={classes.notInVotingGroupParagraph}>
                        <Trans>
                          voterVotingGroupSelect.notRegisteredInSelectedGroupInfoText
                        </Trans>
                      </p>
                      <textarea
                        value={this.state.notInVotingGroupReason}
                        onChange={this.handleNotInVotingGroupReasonChange}
                        className={classes.notInVotingGroupReasonTextArea}
                        placeholder={t('voterVotingGroupSelect.writeReason')}
                        rows={6}
                      />
                    </>
                  )}
                </div>
                <ButtonContainer alignLeft={true}>
                  <Button
                    text={<Trans>general.back</Trans>}
                    action={history.goBack}
                    secondary={true}
                  />
                  <Button
                    text={<Trans>general.proceed</Trans>}
                    // tslint:disable-next-line:jsx-no-lambda
                    action={() =>
                      this.handleProceed(
                        proceedToLink,
                        client,
                        this.state.notInVotingGroupReason
                      )
                    }
                    disabled={
                      !this.hasVotingRights(
                        this.state.selectedVotingGroupIndex
                      ) && this.state.notInVotingGroupReason === ''
                    }
                  />
                </ButtonContainer>
              </PageSection>
            </Page>
          );
        }}
      </Query>
    );
  }
}

export default injectSheet(styles)(
  withRouter(translate()(VotingGroupSelectPage))
);
