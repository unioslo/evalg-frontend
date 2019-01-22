import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import Loading from 'components/loading';
import Link from 'components/link';
import { Page, PageSection } from 'components/page';
import { DropDown } from 'components/form';
import Button, { ButtonContainer } from 'components/button';
import { translate, Trans } from 'react-i18next';
import injectSheet from 'react-jss';
import Icon from 'components/icon';
import { ApolloClient } from 'apollo-boost';
import MandatePeriodText from '../vote/components/MandatePeriodText';
import { History } from 'history';
import { i18n, TranslationFunction } from 'i18next';
import { orderMultipleElections } from 'utils/processGraphQLData';

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
  notInPollBookJustificationTextArea: {
    width: '100%',
    padding: 10,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    border: theme.formFieldBorder,
    borderColor: theme.formFieldBorderColor,
    borderRadius: theme.formFieldBorderRadius,
  },
  notInVoterGroupParagraph: {
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
      type
      elections {
        id
        name
        active
        mandatePeriodStart
        mandatePeriodEnd
        informationUrl
        pollbooks {
          id
          name
        }
      }
    }
  }
`;

interface IProps {
  electionGroupId: string;
  history: History;
  i18n: i18n;
  t: TranslationFunction;
  classes: any;
}

interface IState {
  selectedPollBookIndex: number;
  notInPollBookJustification: string;
}

// Page for selecting voter group / velgergruppe in between selecting an election on the voter
// front page, and voting in a particular election.
// Assuming this to be correct about the data model (recieved graphql query data):
// If the type of the election group is "multiple_elections", i.e. as for a board election / styrevalg,
// the relevant voter groups is given by the names of the elections in the group.
// If the type of the election group is not "multiple_elections", it is assumed to be "single_election",
// and the relevant voter groups is given by the names of the pollbooks in the single election.
// In the first case, choosing a voter group is in effect choosing an election.

class VoterGroupSelectPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedPollBookIndex: 0,
      notInPollBookJustification: '',
    };
    this.handleSelectVoterGroup = this.handleSelectVoterGroup.bind(this);
    this.handlenotInPollBookJustificationChange = this.handlenotInPollBookJustificationChange.bind(
      this
    );
    this.handleProceed = this.handleProceed.bind(this);
  }

  public hasVotingRights(selectedPollBookIndex: number): boolean {
    // Dummy implementation. TODO: Check for which voter group / poll book
    // an actual logged in user has voting rights.
    return selectedPollBookIndex === 0;
  }

  public handleSelectVoterGroup(selectedPollBookIndex: number) {
    this.setState({ selectedPollBookIndex });
  }

  public handlenotInPollBookJustificationChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    this.setState({ notInPollBookJustification: event.target.value });
  }

  public handleProceed(
    proceedToLink: string,
    selectedPollBookID: string,
    notInPollBookJustification: string,
    apolloClient: ApolloClient<any>
  ) {
    // Write "selectedPollBookID" and conditionally "notInPollBookJustification"
    // to local cache, to send with vote later.
    apolloClient.writeData({ data: { selectedPollBookID } });
    if (
      !this.hasVotingRights(this.state.selectedPollBookIndex) &&
      notInPollBookJustification
    ) {
      apolloClient.writeData({ data: { notInPollBookJustification } });
    } else if (this.hasVotingRights(this.state.selectedPollBookIndex)) {
      apolloClient.writeData({ data: { notInPollBookJustification: '' } });
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

          let proceedToLink: string;
          let pollbooks: IPollBook[];

          if (electionGroup.type === 'multiple_elections') {
            pollbooks = orderMultipleElections(elections)
              .filter(election => election.active)
              .map(election => election.pollbooks[0]);
            proceedToLink = `/voter/elections/${
              elections[this.state.selectedPollBookIndex].id
            }/vote`;
          } else {
            pollbooks = elections[0].pollbooks;
            proceedToLink = `/voter/elections/${elections[0].id}/vote`;
          }

          const dropdown = (
            <DropDown
              options={pollbooks.map((pollbook, index) => ({
                value: index,
                name: pollbook.name[lang],
                secondaryLine: this.hasVotingRights(index)
                  ? 'Stemmerett'
                  : null,
              }))}
              value={this.state.selectedPollBookIndex}
              onChange={this.handleSelectVoterGroup}
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
                          <Trans>voterGroupSelect.aboutElectionLink</Trans>
                        </span>
                        <div className={classes.aboutElectionLinkIcon}>
                          <Icon type="externalLink" />
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
                <div className="votingRightsSection">
                  {this.hasVotingRights(this.state.selectedPollBookIndex) ? (
                    <>
                      <p className={classes.subheading}>
                        <Trans>
                          voterGroupSelect.registeredInSelectedGroupHeading
                        </Trans>
                      </p>
                      <div className={classes.ingress}>
                        <span className={classes.beforeDropdownText}>
                          <Trans>
                            voterGroupSelect.registeredInSelectedGroupBeforeDropdownText
                          </Trans>
                        </span>
                        {dropdown}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className={classes.subheading}>
                        <Trans>
                          voterGroupSelect.notRegisteredInSelectedGroupHeading
                        </Trans>
                      </p>
                      <div className={classes.ingress}>
                        <span className={classes.beforeDropdownText}>
                          <Trans>
                            voterGroupSelect.notRegisteredInSelectedGroupBeforeDropdownText
                          </Trans>
                        </span>
                        {dropdown}
                      </div>
                      <p className={classes.notInVoterGroupParagraph}>
                        <Trans>
                          voterGroupSelect.notRegisteredInSelectedGroupInfoText
                        </Trans>
                      </p>
                      <textarea
                        value={this.state.notInPollBookJustification}
                        onChange={this.handlenotInPollBookJustificationChange}
                        className={classes.notInPollBookJustificationTextArea}
                        placeholder={t('voterGroupSelect.writeJustification')}
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
                        pollbooks[this.state.selectedPollBookIndex].id,
                        this.state.notInPollBookJustification,
                        client
                      )
                    }
                    disabled={
                      !this.hasVotingRights(this.state.selectedPollBookIndex) &&
                      this.state.notInPollBookJustification === ''
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

export default injectSheet(styles)(translate()(VoterGroupSelectPage));
