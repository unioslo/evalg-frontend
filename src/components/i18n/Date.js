/* @flow */
import * as React from 'react';
import { translate, Trans } from 'react-i18next';
import moment from 'moment-timezone';

type Props = {
  dateTime: string,
  i18n: Object
};

const formatter = (vals, lang) => {
  const year = vals[0];
  const month = vals[1];
  const day = vals[2];
  if (lang === 'en') { return `${year}.${month}.${day}`; }
  else { return `${day}.${month}.${year}`; }
};

const Date = (props: Props) => {
  if (!props.dateTime) {
    return <b><Trans>election.valueNotSet</Trans></b>
  }
  const date = moment.tz(props.dateTime, "Europe/Oslo").format("YYYY-MM-DD");
  return (
    <span>{formatter(date.split('-'), props.i18n.language)}</span>
  );
};

export default translate()(Date);