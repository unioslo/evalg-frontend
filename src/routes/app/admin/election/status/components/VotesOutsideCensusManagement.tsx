import React from 'react';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';

import {
  StatelessExpandableSubSection,
} from 'components/page/PageSection';

import SelfAddedVotersMngmtTable, {
  VotersReviewTableAction,
} from './SelfAddedVotersMngmtTable';

interface Props extends WithTranslation {
  selfAddedVoters: any;
  categorizedVoters: any;
  adminAddedRejectedVoters: any;
}

interface State {
  isExpandedNotReviewedVoters: boolean;
  isExpandedVerifiedVoters: boolean;
  isExpandedRejectedVoters: boolean;
}

class VotesOutsideCensusManagement extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isExpandedNotReviewedVoters: false,
      isExpandedVerifiedVoters: false,
      isExpandedRejectedVoters: false,
    };
  }

  render() {
    if (
      this.props.selfAddedVoters.error ||
      this.props.adminAddedRejectedVoters.error
    ) {
      return <p>Error!</p>;
    }

    if (
      this.props.selfAddedVoters.loading ||
      this.props.adminAddedRejectedVoters.loading
    ) {
      return (
        <p>
          <Trans>census.loadingVotesOutsideCensus</Trans>
        </p>
      );
    }

    const rejectedVoters = this.props.categorizedVoters.rejectedVoters.concat(
      this.props.adminAddedRejectedVoters.data.searchVoters
    );

    const votesToConsiderHeading = `${this.props.t(
      'admin.manageSelfAddedVoters.votesThatMustBeConsidered'
    )} (${this.props.categorizedVoters.notReviewedVoters.length})`;
    const approvedVotesHeading = `${this.props.t(
      'admin.manageSelfAddedVoters.votesApprovedByTheBoard'
    )} (${this.props.categorizedVoters.verifiedVoters.length})`;
    const rejectedVotesHeading = `${this.props.t(
      'admin.manageSelfAddedVoters.votesRejectedByTheBoard'
    )} (${rejectedVoters.length})`;

    return (
      <>
        <StatelessExpandableSubSection
          setIsExpanded={(newIsExpanded: boolean) =>
            this.setState({ isExpandedNotReviewedVoters: newIsExpanded })
          }
          isExpanded={this.state.isExpandedNotReviewedVoters}
          header={votesToConsiderHeading}
        >
          <SelfAddedVotersMngmtTable
            voters={this.props.categorizedVoters.notReviewedVoters}
            tableAction={VotersReviewTableAction.Review}
          />
        </StatelessExpandableSubSection>

        <StatelessExpandableSubSection
          setIsExpanded={(newIsExpanded: boolean) =>
            this.setState({ isExpandedVerifiedVoters: newIsExpanded })
          }
          isExpanded={this.state.isExpandedVerifiedVoters}
          header={approvedVotesHeading}
        >
          <SelfAddedVotersMngmtTable
            voters={this.props.categorizedVoters.verifiedVoters}
            tableAction={VotersReviewTableAction.UndoApproval}
          />
        </StatelessExpandableSubSection>

        <StatelessExpandableSubSection
          setIsExpanded={(newIsExpanded: boolean) =>
            this.setState({ isExpandedRejectedVoters: newIsExpanded })
          }
          isExpanded={this.state.isExpandedRejectedVoters}
          header={rejectedVotesHeading}
        >
          <SelfAddedVotersMngmtTable
            voters={rejectedVoters}
            tableAction={VotersReviewTableAction.UndoRejection}
          />
        </StatelessExpandableSubSection>
      </>
    );
  }
}

export default withTranslation()(VotesOutsideCensusManagement);
