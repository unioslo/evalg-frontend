import * as React from 'react';
import Date from './Date';
import Time from './Time';

const getTime = (dateTime: string) => {
  if (!dateTime) {
    return <Trans>election.valueNotSet</Trans>
  }
  return <Time dateTime={dateTime} />
};

const getDate = (dateTime: string) => {
  if (!dateTime) {
    return <Trans>election.valueNotSet</Trans>
  }
  return <Date dateTime={dateTime} />
};

export { Date, Time, getTime, getDate };