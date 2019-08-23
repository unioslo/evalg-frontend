import React from 'react';
import { useTranslation } from 'react-i18next';
import { ElectionGroup } from 'interfaces';
import { PageSection } from 'components/page';

import { electionsHasNotStarted } from './VotesSection';
import SurplusVotesMngmt from './SurplusVotesMngmt';

interface IProps {
  electionGroup: ElectionGroup;
  personsWithMultipleVerifiedVoters: any;
}

const SurplusVotesSection: React.FunctionComponent<IProps> = ({
  electionGroup,
  personsWithMultipleVerifiedVoters,
}) => {
  const { t } = useTranslation();

  return (
    <PageSection header={t(`admin.manageSurplusVoters.header`)}>
      {electionsHasNotStarted(electionGroup) ? (
        t('election.electionNotStarted')
      ) : (
        <SurplusVotesMngmt
          electionGroupId={electionGroup.id}
          personsWithMultipleVerifiedVoters={personsWithMultipleVerifiedVoters}
        />
      )}
    </PageSection>
  );
};

export default SurplusVotesSection;
