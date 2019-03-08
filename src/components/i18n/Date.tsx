import * as React from 'react';
import { translate, Trans } from 'react-i18next';
import moment, { Moment } from 'moment-timezone';
import 'moment/locale/nb';
import { appTimezone } from '../../appConfig';
import { i18n } from 'i18next';

interface IProps {
  dateTime: Moment | string,
  longDate: boolean,
  i18n: i18n,
};

const Date = (props: IProps) => {
  if (!props.dateTime) {
    return <Trans>election.valueNotSet</Trans>;
  }
  moment.locale(props.i18n.language);
  const date = props.longDate
    ? moment.tz(props.dateTime, appTimezone).format('LL')
    : moment.tz(props.dateTime, appTimezone).format('L');
  return <span>{date}</span>;
};

export default translate()(Date);
