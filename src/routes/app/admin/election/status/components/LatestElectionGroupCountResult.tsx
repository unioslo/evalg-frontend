import React from 'react';
import injectSheet from 'react-jss';

import { ElectionGroupCount } from 'interfaces';
import { Classes } from 'jss';
import { useTranslation } from 'react-i18next';
import { Date, Time } from 'components/i18n';
import CountDetails from './CountDetails';

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
    <div className={classes.latestResultSection}>
      <h4>
        {t('Oppsummering av siste opptelling startet')}{' '}
        <Date dateTime={count.initiatedAt} longDate />{' '}
        <Time dateTime={count.initiatedAt} /> {t('av')} ?
      </h4>
      <div className={classes.resultBox}>
        <CountDetails electionGroupCount={count} />
      </div>
    </div>
  );
};

export default injectSheet(styles)(LatestElectionGroupCountResult);
