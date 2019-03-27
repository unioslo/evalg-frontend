import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Trans } from 'react-i18next';

import { ElectionGroup, IVoter } from '../../../../../../interfaces';

import DropdownArrowIcon from '../../../../../../components/icons/DropdownArrowIcon';
import SelfAddedVotersTable, {
  VotersReviewTableAction,
} from './SelfAddedVotersTable';

const selfAddedVoters = gql`
  query selfAddedVoters($electionGroupId: UUID!) {
    selfAddedVoters(electionGroupId: $electionGroupId) {
      id
      verifiedStatus
      idType
      idValue
      reason
      pollbook {
        id
        name
      }
    }
  }
`;

interface Props {
  electionGroup: ElectionGroup;
}

const VotesOutsideCensusManagement: React.FunctionComponent<Props> = props => {
  const [isReviewTableExpanded, setIsReviewTableExpanded] = useState(false);
  const [isVerifiedTableExpanded, setIsVerifiedTableExpanded] = useState(false);
  const [isRejectedTableExpanded, setIsRejectedTableExpanded] = useState(false);

  return (
    <Query query={selfAddedVoters}>
      {({ data, loading, error }) => {
        if (error) {
          return 'Error!';
        }

        if (loading) {
          return <Trans>census.loadingVotesOutsideCensus</Trans>;
        }

        const voters = data.selfAddedVoters as IVoter[];
        const notReviewedVoters: IVoter[] = [];
        const verifiedVoters: IVoter[] = [];
        const rejectedVoters: IVoter[] = [];

        voters.forEach(voter => {
          switch (voter.verifiedStatus) {
            case 'SELF_ADDED_NOT_REVIEWED':
              notReviewedVoters.push(voter);
              break;
            case 'SELF_ADDED_VERIFIED':
              verifiedVoters.push(voter);
              break;
            case 'SELF_ADDED_REJECTED':
              rejectedVoters.push(voter);
              break;
          }
        });

        return (
          <>
            <div>
              <div
                onClick={() => setIsReviewTableExpanded(!isReviewTableExpanded)}
              >
                <DropdownArrowIcon selected={isReviewTableExpanded} /> Stemmer
                som må behandles ({notReviewedVoters.length})
              </div>
              {isReviewTableExpanded && (
                <SelfAddedVotersTable
                  voters={notReviewedVoters}
                  tableAction={VotersReviewTableAction.Review}
                />
              )}
            </div>
            <div>
              <div
                onClick={() =>
                  setIsVerifiedTableExpanded(!isVerifiedTableExpanded)
                }
              >
                <DropdownArrowIcon selected={isVerifiedTableExpanded} /> Stemmer
                godkjent av valgstyret ({verifiedVoters.length})
              </div>
              {isVerifiedTableExpanded && (
                <SelfAddedVotersTable
                  voters={verifiedVoters}
                  tableAction={VotersReviewTableAction.Undo}
                />
              )}
            </div>
            <div>
              <div
                onClick={() =>
                  setIsRejectedTableExpanded(!isRejectedTableExpanded)
                }
              >
                <DropdownArrowIcon selected={isRejectedTableExpanded} /> Stemmer
                avvist av valgstyret ({rejectedVoters.length})
              </div>
              {isRejectedTableExpanded && (
                <SelfAddedVotersTable
                  voters={rejectedVoters}
                  tableAction={VotersReviewTableAction.Undo}
                />
              )}
            </div>
          </>
        );
      }}
    </Query>
  );
};

export default VotesOutsideCensusManagement;
