import React from 'react';
import { useTranslation } from 'react-i18next';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import { ElectionGroupCount } from 'interfaces';

import CountDetails from './CountDetails';
import { Date, Time } from 'components/i18n';
import { PageSubSection } from 'components/page';

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
  const { initiatedAt, status } = count;

  return (
    <PageSubSection header={t('Resultat av siste opptelling')}>
      <span>
        Opptelling startet <Date dateTime={count.initiatedAt} longDate />{' '}
        <Time dateTime={count.initiatedAt} /> {t('av')} ?
      </span>
      <div className={classes.resultBox}>
        <CountDetails electionGroupCount={count} />
      </div>
    </PageSubSection>
  );
};

export default injectSheet(styles)(LatestElectionGroupCountResult);
