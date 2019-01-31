/* @flow */
import * as React from 'react';
import { translate, Trans } from 'react-i18next';
import moment from 'moment-timezone';
import 'moment/locale/nb';
import { appTimezone } from 'appConfig';

type Props = {
  dateTime: string,
  longDate: boolean,
  i18n: Object,
};

const Date = (props: Props) => {
  if (!props.dateTime) {
    return <Trans>election.valueNotSet</Trans>;
  }
  moment.locale(props.i18n.language === 'en' ? 'en' : 'nb');
  const date = props.longDate
    ? moment.tz(props.dateTime, appTimezone).format('LL')
    : moment.tz(props.dateTime, appTimezone).format('L');
  return <span>{date}</span>;
};

export default translate()(Date);
