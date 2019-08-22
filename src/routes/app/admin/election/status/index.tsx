import React from 'react';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';

import { Page } from 'components/page';
import { ElectionGroup } from 'interfaces';

import ElectionStatusSection from './components/ElectionStatusSection';
import VotesSection from './components/VotesSection';
import ElectionKeySection from './components/ElectionKeySection';
import CountingSection from './components/CountingSection';

interface IProps extends WithTranslation {
  electionGroup: ElectionGroup;
  refetchElectionGroupFunction: () => Promise<any>;
}

const StatusPage: React.FunctionComponent<IProps> = ({
  electionGroup,
  refetchElectionGroupFunction,
  t
}) => {
  const scrollToStatusRef = React.useRef<HTMLDivElement>(null);

  const showElectionKeySectionAtBottom =
    electionGroup.status === 'ongoing' ||
    electionGroup.status === 'closed' ||
    electionGroup.status === 'multipleStatuses';

  return (
    <>
      <Page header={t('election.electionStatus')}>
        <div ref={scrollToStatusRef} />
        <ElectionStatusSection electionGroup={electionGroup} />
        {!showElectionKeySectionAtBottom && (
          <ElectionKeySection
            electionGroup={electionGroup}
            refetchElectionGroupFunction={refetchElectionGroupFunction}
          />
        )}
        <VotesSection electionGroup={electionGroup} />
        <CountingSection
          electionGroup={electionGroup}
          scrollToStatusRef={scrollToStatusRef}
        />
        {showElectionKeySectionAtBottom && (
          <ElectionKeySection
            electionGroup={electionGroup}
            refetchElectionGroupFunction={refetchElectionGroupFunction}
          />
        )}
      </Page>
    </>
  );
};

export default withTranslation()(StatusPage);
