/* @flow */
import * as React from 'react';
import { translate, Trans } from 'react-i18next';
import moment, { Moment } from 'moment-timezone';
import { appTimezone } from '../../appConfig';
import { i18n } from 'i18next';

interface IProps {
  dateTime: Moment | string,
  i18n: i18n,
};

const prefixes: any = {
  en: 'at',
  nb: 'kl',
};

const Time = (props: IProps) => {
  if (!props.dateTime) {
    return <Trans>election.valueNotSet</Trans>;
  }
  moment.locale(props.i18n.language);
  const lang = props.i18n.language;
  const time = moment.tz(props.dateTime, appTimezone).format('LT');
  return <span>{`${prefixes[lang]} ${time}`}</span>;
};

export default translate()(Time);
