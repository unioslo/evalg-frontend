import gql from 'graphql-tag';
import React from 'react';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';
import injectSheet from 'react-jss';
import { WithApolloClient, withApollo } from 'react-apollo';

import {
  Election,
  IPollBook,
  VotersForPersonResponse,
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
import ErrorPageSection from '../../../../components/errors/ErrorPageSection';
import { Redirect } from 'react-router';

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
  voters: IVoter[];
  fetchingVoters: boolean;
  error: string;
  redirectBack: boolean;
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
    voters: [],
    fetchingVoters: true,
    error: '',
    redirectBack: false,
  };

  componentDidMount() {
    this.fetchVotersForPerson();
  }

  async fetchVotersForPerson() {
    let personId = '';

    try {
      personId = await getSignedInPersonId(this.props.client);
    } catch (error) {
      this.setState({ error: "Can't resolve logged in person ID." });
      return;
    }

    let voters: IVoter[] = [];
    try {
      const res = await this.props.client.query<VotersForPersonResponse>({
        query: votersForPersonQuery,
        variables: { id: personId },
      });

      voters = res.data.votersForPerson;
    } catch (error) {
      this.setState({ error: "Can't find voters for person." });
      return;
    }

    // Find and set the the first census the voter is in as selected.
    const { EGPollbooks } = this.getCommonVars();
    const pollbookIdsForVerifiedVoters = voters
      .filter(voter => voter.verified)
      .map(voter => voter.pollbook.id);

    const initiallySelectIndex: number = EGPollbooks.findIndex(EGPollbook =>
      pollbookIdsForVerifiedVoters.includes(EGPollbook.id)
    );
    if (initiallySelectIndex >= 0) {
      this.setState({ selectedPollBookIndex: initiallySelectIndex });
    }

    this.setState({ voters, fetchingVoters: false });
  }

  getMaybeVoterForSelectedPollbook = (
    selectedPollBookIndex: number,
    EGPollbooks: IPollBook[]
  ): IVoter | null => {
    const voters: IVoter[] = this.state.voters;
    const filteredVoters = voters.filter(
      v => v.pollbook.id === EGPollbooks[selectedPollBookIndex].id
    );

    if (filteredVoters.length === 1) {
      return filteredVoters[0];
    } else {
      return null;
    }
  };

  hasRightToVote = (
    selectedPollBookIndex: number,
    EGPollbooks: IPollBook[]
  ): boolean => {
    const voters: IVoter[] = this.state.voters.filter(
      (voter: IVoter) => voter.verified === true
    );

    return voters
      .map(x => x.pollbook.id)
      .includes(EGPollbooks[selectedPollBookIndex].id);
  };

  handleSelectVoterGroup = (selectedPollBookIndex: number) => {
    this.setState({ selectedPollBookIndex });
  };

  handlenotInPollBookJustificationChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({ notInPollBookJustification: event.target.value });
  };

  private getCommonVars() {
    const { electionGroupType, activeElections } = this.props;

    let EGPollbooks: IPollBook[];
    let voteElection: Election;
    let voteElectionIndex: number;
    let electionIsOngoing = true;

    if (electionGroupType === 'multiple_elections') {
      EGPollbooks = activeElections.map(election => election.pollbooks[0]);
      voteElectionIndex = this.state.selectedPollBookIndex;
    } else {
      EGPollbooks = activeElections[0].pollbooks;
      voteElectionIndex = 0;
    }

    voteElection = activeElections[voteElectionIndex];

    if (voteElection.status !== 'ongoing') {
      electionIsOngoing = false;
    }

    return {
      EGPollbooks,
      voteElection,
      voteElectionIndex,
      electionIsOngoing,
    };
  }

  public render() {
    const lang = this.props.i18n.language;
    const classes = this.props.classes;
    const t = this.props.t;

    const {
      EGPollbooks,
      voteElection,
      voteElectionIndex,
      electionIsOngoing,
    } = this.getCommonVars();

    const dropdown = (
      <DropDown
        options={EGPollbooks.map((pollbook: any, index: any) => ({
          value: index,
          name: pollbook.name[lang],
          secondaryLine: this.hasRightToVote(index, EGPollbooks)
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

    if (electionIsOngoing) {
      if (this.hasRightToVote(this.state.selectedPollBookIndex, EGPollbooks)) {
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
      if (voteElection.status === 'published') {
        subheading = <Trans>voterGroupSelect.electionNotYetOpen</Trans>;
        beforeDropDownText = <Trans>voterGroupSelect.theElectionFor</Trans>;
        afterDropDownText = (
          <>
            <Trans>voterGroupSelect.opens</Trans>{' '}
            <Date dateTime={voteElection.start} longDate />{' '}
            <Time dateTime={voteElection.start} />.
          </>
        );
        additionalInformation = (
          <>
            <Trans>voterGroupSelect.theElectionFor</Trans>{' '}
            {EGPollbooks[this.state.selectedPollBookIndex].name[
              lang
            ].toLowerCase()}{' '}
            <Trans>voterGroupSelect.opens</Trans>{' '}
            <Date dateTime={voteElection.start} longDate />{' '}
            <Time dateTime={voteElection.start} />{' '}
            <Trans>voterGroupSelect.andCloses</Trans>{' '}
            <Date dateTime={voteElection.end} longDate />{' '}
            <Time dateTime={voteElection.end} />.
          </>
        );
      } else if (voteElection.status === 'closed') {
        subheading = <Trans>voterGroupSelect.electionClosed</Trans>;
        beforeDropDownText = <Trans>voterGroupSelect.theElectionFor</Trans>;
        afterDropDownText = (
          <>
            <Trans>voterGroupSelect.wasClosed</Trans>{' '}
            <Date dateTime={voteElection.end} longDate />{' '}
            <Time dateTime={voteElection.end} />.
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

    if (this.state.error) {
      return <ErrorPageSection errorMessage={this.state.error} />;
    }

    if (this.state.fetchingVoters) {
      return (
        <PageSection noBorder>
          <Loading>
            <Trans>general.loading</Trans>
          </Loading>
        </PageSection>
      );
    }

    return (
      <PageSection noBorder={true}>
        <div className={classes.electionGroupInfoSection}>
          <div className={classes.mandatePeriodTextDesktop}>
            <MandatePeriodText election={voteElection} longDate />
          </div>

          <div className={classes.mandatePeriodTextMobile}>
            <MandatePeriodText election={voteElection} />
          </div>

          {voteElection.informationUrl && (
            <p>
              <Trans>voterGroupSelect.moreAboutTheElection</Trans>:{' '}
              <Link to={voteElection.informationUrl} external>
                {voteElection.informationUrl}
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
          <Button
            text={<Trans>general.back</Trans>}
            secondary={true}
            action={() => {
              this.setState({ redirectBack: true });
            }}
          />
          <Button
            text={<Trans>general.proceed</Trans>}
            action={() => {
              const selectedPollbookId =
                EGPollbooks[this.state.selectedPollBookIndex].id;
              const notInPollBookJustification = this.hasRightToVote(
                this.state.selectedPollBookIndex,
                EGPollbooks
              )
                ? ''
                : this.state.notInPollBookJustification;
              const maybeVoterForSelectedPollbook = this.getMaybeVoterForSelectedPollbook(
                this.state.selectedPollBookIndex,
                EGPollbooks
              );

              this.props.onProceed(
                voteElectionIndex,
                selectedPollbookId,
                maybeVoterForSelectedPollbook,
                notInPollBookJustification
              );
            }}
            disabled={!electionIsOngoing}
          />
        </ButtonContainer>
        {this.state.redirectBack && <Redirect push to="/" />}
      </PageSection>
    );
  }
}

export default injectSheet(styles)(
  withTranslation()(withApollo(VoterGroupSelectPage))
);
