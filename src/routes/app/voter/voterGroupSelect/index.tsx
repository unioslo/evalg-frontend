import React from 'react';
import { ApolloClient } from 'apollo-client';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { History } from 'history';
import { i18n, TranslationFunction } from 'i18next';
import { translate, Trans } from 'react-i18next';
import injectSheet from 'react-jss';

import Loading from '../../../../components/loading';
import Link from '../../../../components/link';
import { Page, PageSection } from '../../../../components/page';
import { DropDown } from '../../../../components/form';
import Button, { ButtonContainer } from '../../../../components/button';
import MandatePeriodText from '../vote/components/MandatePeriodText';
import { orderMultipleElections } from '../../../../utils/processGraphQLData';
import { Date, Time } from '../../../../components/i18n';
import { Election, ElectionGroup, IPollBook } from '../../../../interfaces';
import VotingStepper from '../vote/components/VotingStepper';

const styles = (theme: any) => ({
  dropDownSelectionText: {
    position: 'relative', // "anchor" for dropdown list absolute position
    ...theme.ingress,
    fontSize: '2rem',
    [theme.breakpoints.mdQuery]: {
      fontSize: '2.2rem',
    },
    '& .beforeDropdownText': {
      paddingRight: '0.8rem',
    },
  },
  subheading: {
    fontSize: '2.2rem',
    fontWeight: 'bold',
    lineHeight: '2.7rem',
    marginBottom: '1.8rem',
    [theme.breakpoints.mdQuery]: {
      fontSize: '2.6rem',
      fontWeight: 'normal',
    },
  },
  electionGroupInfoSection: {
    marginBottom: '3rem',
    [theme.breakpoints.mdQuery]: {
      marginBottom: '5rem',
    },
  },
  votingRightsSection: {
    [theme.breakpoints.mdQuery]: {
      marginBottom: '5rem',
    },
  },
  notInPollBookJustificationTextArea: {
    width: '100%',
    padding: 10,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    border: theme.formFieldBorder,
    borderColor: theme.formFieldBorderColor,
    borderRadius: theme.formFieldBorderRadius,
  },
  additionalInformationParagraph: {
    marginTop: '2.2rem',
    marginBottom: '2rem',
  },
  mandatePeriodTextDesktop: {
    display: 'none',
    [theme.breakpoints.mdQuery]: {
      display: 'inherit',
      ...theme.ingress,
      marginBottom: '1.5rem',
    },
  },
  mandatePeriodTextMobile: {
    [theme.breakpoints.mdQuery]: {
      display: 'none',
    },
  },
  aboutElectionLinkText: {
    fontSize: '1.8rem',
    marginTop: '1.8rem',
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
        status
        start
        end
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
// the relevant voter groups is given by the names of the first and presumably only pollbook for each
// election in the group.
// If the type of the election group is not "multiple_elections", it is assumed to be "single_election",
// and the relevant voter groups is given by the names of the pollbooks in the single election.
// In the first case, choosing a voter group is in effect choosing an election.

class VoterGroupSelectPage extends React.Component<IProps, IState> {
  scrollToDivRef: React.RefObject<HTMLDivElement>;

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
    this.scrollToDivRef = React.createRef();
  }

  componentDidMount() {
    if (this.scrollToDivRef.current) {
      this.scrollToDivRef.current.scrollIntoView();
    }
  }

  public hasRightToVote(selectedPollBookIndex: number): boolean {
    // Dummy implementation. TODO: Check for which voter group / poll book
    // an actual logged in user has right to vote.
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
      !this.hasRightToVote(this.state.selectedPollBookIndex) &&
      notInPollBookJustification
    ) {
      apolloClient.writeData({ data: { notInPollBookJustification } });
    } else if (this.hasRightToVote(this.state.selectedPollBookIndex)) {
      apolloClient.writeData({ data: { notInPollBookJustification: '' } });
    }
    this.props.history.push(proceedToLink);
  }

  public render() {
    const lang = this.props.i18n.language;
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
          const electionGroupName: string = electionGroup.name[lang];
          const elections: Election[] = electionGroup.elections;

          let pollbooks: IPollBook[];
          let electionForSelectedPollbook: Election;
          let electionForSelectedPollbookIsOngoing = true;

          if (electionGroup.type === 'multiple_elections') {
            const activeOrderedElections = orderMultipleElections(
              elections
            ).filter(e => e.active);

            pollbooks = activeOrderedElections.map(
              election => election.pollbooks[0]
            );

            electionForSelectedPollbook =
              activeOrderedElections[this.state.selectedPollBookIndex];

            if (electionForSelectedPollbook.status !== 'ongoing') {
              electionForSelectedPollbookIsOngoing = false;
            }
          } else {
            pollbooks = elections[0].pollbooks;
            electionForSelectedPollbook = elections[0];
          }
          const proceedToLink = `/voter/elections/${
            electionForSelectedPollbook.id
          }/vote`;

          const dropdown = (
            <DropDown
              options={pollbooks.map((pollbook: any, index: any) => ({
                value: index,
                name: pollbook.name[lang],
                secondaryLine: this.hasRightToVote(index)
                  ? t('voterGroupSelect.youAreOnTheElectoralRoll')
                  : null,
              }))}
              value={this.state.selectedPollBookIndex}
              onChange={this.handleSelectVoterGroup}
              inline
              noRelativePositionOfListOnMobile
            />
          );

          let subheading: React.ReactNode = null;
          let beforeDropDownText: React.ReactNode = null;
          let afterDropDownText: React.ReactNode = null;
          let additionalInformation: React.ReactNode = null;
          let extraElements: React.ReactNode = null;

          if (electionForSelectedPollbookIsOngoing) {
            if (this.hasRightToVote(this.state.selectedPollBookIndex)) {
              subheading = (
                <Trans>voterGroupSelect.registeredInSelectedGroupHeading</Trans>
              );
              beforeDropDownText = (
                <Trans>
                  voterGroupSelect.registeredInSelectedGroupBeforeDropdownText
                </Trans>
              );
            } else {
              subheading = (
                <Trans>
                  voterGroupSelect.notRegisteredInSelectedGroupHeading
                </Trans>
              );
              beforeDropDownText = (
                <Trans>
                  voterGroupSelect.notRegisteredInSelectedGroupBeforeDropdownText
                </Trans>
              );
              additionalInformation = (
                <Trans>
                  voterGroupSelect.notRegisteredInSelectedGroupInfoText
                </Trans>
              );
              extraElements = (
                <textarea
                  value={this.state.notInPollBookJustification}
                  onChange={this.handlenotInPollBookJustificationChange}
                  className={classes.notInPollBookJustificationTextArea}
                  placeholder={t('voterGroupSelect.writeJustification')}
                  rows={6}
                />
              );
            }
          } else {
            if (electionForSelectedPollbook.status === 'published') {
              subheading = <Trans>voterGroupSelect.electionNotYetOpen</Trans>;
              beforeDropDownText = (
                <Trans>voterGroupSelect.theElectionFor</Trans>
              );
              afterDropDownText = (
                <>
                  <Trans>voterGroupSelect.opens</Trans>{' '}
                  <Date dateTime={electionForSelectedPollbook.start} longDate />{' '}
                  <Time dateTime={electionForSelectedPollbook.start} />.
                </>
              );
              additionalInformation = (
                <>
                  <Trans>voterGroupSelect.theElectionFor</Trans>{' '}
                  {pollbooks[this.state.selectedPollBookIndex].name[
                    lang
                  ].toLowerCase()}{' '}
                  <Trans>voterGroupSelect.opens</Trans>{' '}
                  <Date dateTime={electionForSelectedPollbook.start} longDate />{' '}
                  <Time dateTime={electionForSelectedPollbook.start} />{' '}
                  <Trans>voterGroupSelect.andCloses</Trans>{' '}
                  <Date dateTime={electionForSelectedPollbook.end} longDate />{' '}
                  <Time dateTime={electionForSelectedPollbook.end} />.
                </>
              );
            } else if (electionForSelectedPollbook.status === 'closed') {
              subheading = <Trans>voterGroupSelect.electionClosed</Trans>;
              beforeDropDownText = (
                <Trans>voterGroupSelect.theElectionFor</Trans>
              );
              afterDropDownText = (
                <>
                  <Trans>voterGroupSelect.wasClosed</Trans>{' '}
                  <Date dateTime={electionForSelectedPollbook.end} longDate />{' '}
                  <Time dateTime={electionForSelectedPollbook.end} />.
                </>
              );
            } else {
              subheading = <Trans>voterGroupSelect.electionNotOpen</Trans>;
              beforeDropDownText = (
                <Trans>voterGroupSelect.theElectionFor</Trans>
              );
              afterDropDownText = (
                <>
                  <Trans>voterGroupSelect.isNotOpen</Trans> .
                </>
              );
            }
          }

          return (
            <>
              <VotingStepper
                currentStep={1}
                scrollToDivRef={this.scrollToDivRef}
              />
              <Page header={electionGroupName}>
                <PageSection noBorder={true}>
                  <div className={classes.electionGroupInfoSection}>
                    <div className={classes.mandatePeriodTextDesktop}>
                      <MandatePeriodText
                        election={electionForSelectedPollbook}
                        longDate
                      />
                    </div>

                    <div className={classes.mandatePeriodTextMobile}>
                      <MandatePeriodText
                        election={electionForSelectedPollbook}
                      />
                    </div>

                    {electionForSelectedPollbook.informationUrl && (
                      <p>
                        <Trans>voterGroupSelect.moreAboutTheElection</Trans>:{' '}
                        <Link
                          to={electionForSelectedPollbook.informationUrl}
                          external
                        >
                          {electionForSelectedPollbook.informationUrl}
                        </Link>
                      </p>
                    )}
                  </div>

                  <div className={classes.votingRightsSection}>
                    <p className={classes.subheading}>{subheading}</p>
                    <div className={classes.dropDownSelectionText}>
                      <span className="beforeDropdownText">
                        {beforeDropDownText}
                      </span>
                      {dropdown} {afterDropDownText}
                    </div>
                    <p className={classes.additionalInformationParagraph}>
                      {additionalInformation}
                    </p>
                    {extraElements}
                  </div>

                  <ButtonContainer alignLeft={true}>
                    <Link to="/voter">
                      <Button
                        text={<Trans>general.back</Trans>}
                        secondary={true}
                      />
                    </Link>
                    <Button
                      text={<Trans>general.proceed</Trans>}
                      action={() =>
                        this.handleProceed(
                          proceedToLink,
                          pollbooks[this.state.selectedPollBookIndex].id,
                          this.state.notInPollBookJustification,
                          client
                        )
                      }
                      disabled={!electionForSelectedPollbookIsOngoing}
                    />
                  </ButtonContainer>
                </PageSection>
              </Page>
            </>
          );
        }}
      </Query>
    );
  }
}

export default injectSheet(styles)(translate()(VoterGroupSelectPage));
