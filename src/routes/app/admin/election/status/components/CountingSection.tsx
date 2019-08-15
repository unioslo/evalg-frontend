import React from 'react';
import {
  WithTranslation,
  withTranslation,
} from 'react-i18next';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { ElectionGroup } from 'interfaces';
import { ElectionGroupCountFields } from 'fragments';

import { PageSection } from 'components/page';
import Button, { ButtonContainer } from 'components/button';
import CountingModal from './CountingModal';
import CountingSectionCounts from './CountingSectionCounts';
import { Classes } from 'jss';
import injectSheet from 'react-jss';

export const electionGroupCountsQuery = gql`
  ${ElectionGroupCountFields}
  query electionGroupCounts($id: UUID!) {
    electionGroupCountingResults(id: $id) {
      ...ElectionGroupCountFields
    }
  }
`;

const styles = (theme: any) => ({
  warningParagraph: {
    color: theme.colors.darkRed,
  },
});

interface Props extends WithTranslation {
  electionGroup: ElectionGroup;
  scrollToStatusRef: React.RefObject<HTMLDivElement>;
  selfAddedVoters: any;
  categorizedVoters: any;
  personsWithMultipleVerifiedVoters: any;
  classes: Classes;
}

interface State {
  showModal: boolean;
  message: string;
}

class CountingSection extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { showModal: false, message: '' };
  }

  componentWillUpdate(newProps: Props, newState: State) { 
    if (this.state.message !== '') {
      this.setState({ message: '' });
    }
  }

  public getMessage = () => {
    if (
      !(
        this.props.selfAddedVoters.loading || this.props.selfAddedVoters.error
      ) &&
      this.props.categorizedVoters.notReviewedVoters.length > 0
    ) {
      return this.props.t(`admin.countingSection.warningSelfAddedVoters`);
    }
    if (
      !(
        this.props.personsWithMultipleVerifiedVoters.loading ||
        this.props.personsWithMultipleVerifiedVoters.error
      ) &&
      this.props.personsWithMultipleVerifiedVoters.data
        .personsWithMultipleVerifiedVoters.length > 0
    ) {
      return this.props.t(
        `admin.countingSection.warningPersonsWithMultipleVoters`
      );
    }
    return '';
  };

  public handleShowModal = () => {
    const tempMessage = this.getMessage();

    if (tempMessage === '') {
      this.setState({ showModal: true });
    } else {
      this.setState({ message: tempMessage });
    }
  };

  public handleCancelModal = () => {
    this.setState({ showModal: false });
  };


  public handleCloseModalAndSeeResults = () => {
    this.setState({ showModal: false });
    if (this.props.scrollToStatusRef.current) {
      setTimeout(
        () =>
          this.props.scrollToStatusRef.current &&
          this.props.scrollToStatusRef.current.scrollIntoView(),
        0
      );
    }
  };

  render() {
    return (
      <PageSection header={this.props.t('admin.countingSection.header')}>
        {this.props.electionGroup.status === 'closed' ? (
          <ButtonContainer alignLeft smlTopMargin>
            <Query
              query={electionGroupCountsQuery}
              variables={{ id: this.props.electionGroup.id }}
            >
              {({ data, loading, error }) => {
                const showFirstTimeCountingButton =
                  error ||
                  loading ||
                  data.electionGroupCountingResults.length === 0;

                return (
                  <Button
                    text={
                      showFirstTimeCountingButton
                        ? this.props.t('admin.countingSection.startCounting')
                        : this.props.t('admin.countingSection.startNewCounting')
                    }
                    action={this.handleShowModal}
                    secondary={!showFirstTimeCountingButton}
                  />
                );
              }}
            </Query>
            <p className={this.props.classes.warningParagraph}>
              {this.state.message}
            </p>
          </ButtonContainer>
        ) : (
          this.props.t('election.electionNotClosed')
        )}

        {this.state.showModal && (
          <CountingModal
            electionGroup={this.props.electionGroup}
            onCancelModal={this.handleCancelModal}
            onCloseModalAndSeeResults={this.handleCloseModalAndSeeResults}
          />
        )}

        <CountingSectionCounts electionGroupId={this.props.electionGroup.id} />
      </PageSection>
    );
  }
}

export default injectSheet(styles)(withTranslation()(CountingSection));
