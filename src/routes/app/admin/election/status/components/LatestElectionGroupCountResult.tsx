import React from 'react';
import { useTranslation } from 'react-i18next';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import { ElectionGroupCount } from 'interfaces';

import CountDetails from './CountDetails';
import { Date, Time } from 'components/i18n';
import { PageSubSection } from 'components/page';
import { idValueForPerson } from 'utils/processGraphQLData';

const styles = (theme: any) => ({
  latestResultSection: {
    marginTop: '2rem',
  },
  resultBox: {
    border: `1px solid ${theme.sectionBorderColor}`,
    borderRadius: '3px',
    padding: '2rem',
    marginTop: '2rem',
  },
});

interface IProps {
  electionGroupCount: ElectionGroupCount;
  classes: Classes;
}

const LatestElectionGroupCountResult: React.FunctionComponent<IProps> = ({
  electionGroupCount: count,
  classes,
}) => {
  const { t } = useTranslation();
  const { initiatedAt, initiatedBy } = count;

  return (
    <PageSubSection
      header={t(
        'admin.statusSection.latestElectionGroupCount.subsectionHeader'
      )}
    >
      <span>
        {t('admin.statusSection.latestElectionGroupCount.countingStarted')}{' '}
        <Date dateTime={initiatedAt} longDate /> <Time dateTime={initiatedAt} />{' '}
        {t('general.by')} {idValueForPerson(initiatedBy)}
      </span>
      <div className={classes.resultBox}>
        <CountDetails electionGroupCount={count} />
      </div>
    </PageSubSection>
  );
};

export default injectSheet(styles)(LatestElectionGroupCountResult);
