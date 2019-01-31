/* @flow */
import * as React from 'react';
import { translate, Trans } from 'react-i18next';
import moment from 'moment-timezone';

type Props = {
  dateTime: string,
  i18n: Object
};

const prefixes = {
  en: 'at',
  nb: 'kl'
};

const Time = (props: Props) => {
  if (!props.dateTime) { return 'Not set' };
  const time = moment.tz(props.dateTime, "Europe/Oslo").format("HH:mm");
  const lang = props.i18n.language;
  const hrMinValues = time.split(':');
  return (
    <span>{`${prefixes[lang]} ${hrMinValues[0]}.${hrMinValues[1]}`}</span>
  );
}

export default translate()(Time);