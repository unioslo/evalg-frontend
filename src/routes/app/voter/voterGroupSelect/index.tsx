import gql from 'graphql-tag';
import React from 'react';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';
import injectSheet from 'react-jss';
import { WithApolloClient, withApollo } from 'react-apollo';

import {
  Election,
  IPollBook,
  ViewerResponse,
  VotersForPersonResponse,
  QueryResponse,
  IVoter,
} from '../../../../interfaces';
import { getSignedInPersonId } from '../../../../queries';

import Link from '../../../../components/link';
import { PageSection } from '../../../../components/page';
import { DropDown } from '../../../../components/form';
import Button, { ButtonContainer } from '../../../../components/button';
import MandatePeriodText from '../vote/components/MandatePeriodText';
import { Date, Time } from '../../../../components/i18n';
import Loading from '../../../../components/loading';

const votersForPersonQuery = gql`
  query votersForPerson($id: UUID!) {
    votersForPerson(id: $id) {
      id
      verified
      pollbook {
        id
      }
    }
  }
`;

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

interface IProps extends WithTranslation {
  electionGroupType: string;
  activeElections: Election[];
  onProceed: (
    selectedElectionIndex: number,
    selectedPollBookId: string,
    voter: IVoter | null,
    notInPollBookJustification: string
  ) => void;
  classes: any;
}

type IState = {
  selectedPollBookIndex: number;
  notInPollBookJustification: string;
  personId: string;
  voters: IVoter[];
  fetchingVoters: boolean;
};

// Page for selecting voter group / velgergruppe in between selecting an election on the voter
// front page, and voting in a particular election.
// Assuming this to be correct about the data model (recieved graphql query data):
// If the type of the election group is "multiple_elections", i.e. as for a board election / styrevalg,
// the relevant voter groups is given by the names of the first and presumably only pollbook for each
// election in the group.
// If the type of the election group is not "multiple_elections", it is assumed to be "single_election",
// and the relevant voter groups is given by the names of the pollbooks in the single election.
// In the first case, choosing a voter group is in effect choosing an election.

class VoterGroupSelectPage extends React.Component<
  WithApolloClient<IProps>,
  IState
> {
  readonly state = {
    selectedPollBookIndex: 0,
    notInPollBookJustification: '',
    personId: '',
    voters: [],
    fetchingVoters: true,
  };

  componentDidMount() {
    this.getPersonId();
  }

  async getPersonId() {
    const handleSuccess = (p: QueryResponse<ViewerResponse>) => {
      this.setState({ personId: p.data.signedInPerson.personId });
    };
    const handleFailure = (error: any) => {
      // TODO: Render proper error
    };
    await getSignedInPersonId(this.props.client, handleSuccess, handleFailure);

    try {
      const v = await this.props.client.query<VotersForPersonResponse>({
        query: votersForPersonQuery,
        variables: { id: this.state.personId },
      });

      this.setState({ voters: v.data.votersForPerson });
    } catch (error) {
      // TODO: Render proper error
    }

    // Find and set the the first census the voter is in as selected.
    // TODO prioritize census if multiple? Now we return the first match.
    const { pollbooks } = this.getCommonVars();
    const voters: string[] = this.state.voters
      .filter((voter: IVoter) => voter.verified === true)
      .map((voter: IVoter) => voter.pollbook.id);

    const initialIndex: number = pollbooks.findIndex(pollbook =>
      voters.includes(pollbook.id)
    );

    if (initialIndex >= 0) {
      this.setState({ selectedPollBookIndex: initialIndex });
    }
    this.setState({ fetchingVoters: false });
  }

  getVoter = (pollBookIndex: number) => {
    const { pollbooks } = this.getCommonVars();
    const voters: IVoter[] = this.state.voters;
    const filteredVoters = voters.filter(
      x => x.pollbook.id === pollbooks[pollBookIndex].id
    );

    if (filteredVoters.length === 1) {
      return filteredVoters[0];
    } else {
      return null;
    }
  };

  hasRightToVote = (pollBookIndex: number): boolean => {
    const { pollbooks } = this.getCommonVars();
    const voters: IVoter[] = this.state.voters.filter(
      (voter: IVoter) => voter.verified === true
    );

    return voters.map(x => x.pollbook.id).includes(pollbooks[pollBookIndex].id);
  };

  handleSelectVoterGroup = (selectedPollBookIndex: number) => {
    this.setState({ selectedPollBookIndex });
  };

  handlenotInPollBookJustificationChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({ notInPollBookJustification: event.target.value });
  };

  handleProceed = (
    selectedElectionIndex: number,
    selectedPollBookId: string,
    voter: IVoter | null,
    notInPollBookJustification: string
  ) => {
    this.props.onProceed(
      selectedElectionIndex,
      selectedPollBookId,
      voter,
      this.hasRightToVote(this.state.selectedPollBookIndex)
        ? ''
        : notInPollBookJustification
    );
  };

  private getCommonVars() {
    const { electionGroupType, activeElections } = this.props;

    let pollbooks: IPollBook[];
    let electionForSelectedPollbook: Election;
    let electionForSelectedPollbookIndex: number;
    let electionForSelectedPollbookIsOngoing = true;

    if (electionGroupType === 'multiple_elections') {
      pollbooks = activeElections.map(election => election.pollbooks[0]);

      electionForSelectedPollbookIndex = this.state.selectedPollBookIndex;
      electionForSelectedPollbook =
        activeElections[electionForSelectedPollbookIndex];

      if (electionForSelectedPollbook.status !== 'ongoing') {
        electionForSelectedPollbookIsOngoing = false;
      }
    } else {
      pollbooks = activeElections[0].pollbooks;
      electionForSelectedPollbook = activeElections[0];
      electionForSelectedPollbookIndex = 0;
    }
    return {
      pollbooks,
      electionForSelectedPollbook,
      electionForSelectedPollbookIndex,
      electionForSelectedPollbookIsOngoing,
    };
  }

  public render() {
    const lang = this.props.i18n.language;
    const classes = this.props.classes;
    const t = this.props.t;

    const {
      pollbooks,
      electionForSelectedPollbook,
      electionForSelectedPollbookIndex,
      electionForSelectedPollbookIsOngoing,
    } = this.getCommonVars();

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
          <Trans>voterGroupSelect.notRegisteredInSelectedGroupHeading</Trans>
        );
        beforeDropDownText = (
          <Trans>
            voterGroupSelect.notRegisteredInSelectedGroupBeforeDropdownText
          </Trans>
        );
        additionalInformation = (
          <Trans>voterGroupSelect.notRegisteredInSelectedGroupInfoText</Trans>
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
        beforeDropDownText = <Trans>voterGroupSelect.theElectionFor</Trans>;
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
        beforeDropDownText = <Trans>voterGroupSelect.theElectionFor</Trans>;
        afterDropDownText = (
          <>
            <Trans>voterGroupSelect.wasClosed</Trans>{' '}
            <Date dateTime={electionForSelectedPollbook.end} longDate />{' '}
            <Time dateTime={electionForSelectedPollbook.end} />.
          </>
        );
      } else {
        subheading = <Trans>voterGroupSelect.electionNotOpen</Trans>;
        beforeDropDownText = <Trans>voterGroupSelect.theElectionFor</Trans>;
        afterDropDownText = (
          <>
            <Trans>voterGroupSelect.isNotOpen</Trans> .
          </>
        );
      }
    }

    if (this.state.fetchingVoters) {
      return (
        <Loading>
          <Trans>voter.loading</Trans>
        </Loading>
      );
    }

    return (
      <PageSection noBorder={true}>
        <div className={classes.electionGroupInfoSection}>
          <div className={classes.mandatePeriodTextDesktop}>
            <MandatePeriodText
              election={electionForSelectedPollbook}
              longDate
            />
          </div>

          <div className={classes.mandatePeriodTextMobile}>
            <MandatePeriodText election={electionForSelectedPollbook} />
          </div>

          {electionForSelectedPollbook.informationUrl && (
            <p>
              <Trans>voterGroupSelect.moreAboutTheElection</Trans>:{' '}
              <Link to={electionForSelectedPollbook.informationUrl} external>
                {electionForSelectedPollbook.informationUrl}
              </Link>
            </p>
          )}
        </div>

        <div className={classes.votingRightsSection}>
          <p className={classes.subheading}>{subheading}</p>
          <div className={classes.dropDownSelectionText}>
            <span className="beforeDropdownText">{beforeDropDownText}</span>
            {dropdown} {afterDropDownText}
          </div>
          <p className={classes.additionalInformationParagraph}>
            {additionalInformation}
          </p>
          {extraElements}
        </div>

        <ButtonContainer alignLeft={true}>
          <Link to="/">
            <Button text={<Trans>general.back</Trans>} secondary={true} />
          </Link>
          <Button
            text={<Trans>general.proceed</Trans>}
            action={() =>
              this.handleProceed(
                electionForSelectedPollbookIndex,
                pollbooks[this.state.selectedPollBookIndex].id,
                this.getVoter(this.state.selectedPollBookIndex),
                this.state.notInPollBookJustification
              )
            }
            disabled={!electionForSelectedPollbookIsOngoing}
          />
        </ButtonContainer>
      </PageSection>
    );
  }
}

export default injectSheet(styles)(
  withTranslation()(withApollo(VoterGroupSelectPage))
);
