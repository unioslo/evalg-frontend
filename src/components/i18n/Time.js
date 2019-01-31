/* @flow */
import * as React from 'react';
import { translate, Trans } from 'react-i18next';
import moment from 'moment-timezone';
import { appTimezone } from 'appConfig';

type Props = {
  dateTime: string,
  i18n: Object,
};

const prefixes = {
  en: 'at',
  nb: 'kl',
};

const Time = (props: Props) => {
  if (!props.dateTime) {
    return <Trans>election.valueNotSet</Trans>;
  }
  moment.locale(props.i18n.language === 'en' ? 'en' : 'nb');
  const lang = props.i18n.language;
  const time = moment.tz(props.dateTime, appTimezone).format('LT');
  return <span>{`${prefixes[lang]} ${time}`}</span>;
};

export default translate()(Time);
