/* @flow */
import * as React from 'react';
import { translate, Trans } from 'react-i18next';

type Props = {
  dateTime: string,
  i18n: Object
};

const prefixes = {
  en: 'at',
  nb: 'kl'
};

const getTime = (dateTime) => dateTime.substring(11, 16);

const Time = (props: Props) => {
  if (!props.dateTime) { return 'Not set' };
  const time = getTime(props.dateTime);
  const lang = props.i18n.language;
  const hrMinValues = time.split(':');
  return (
    <span>{`${prefixes[lang]} ${hrMinValues[0]}.${hrMinValues[1]}`}</span>
  );
}

export default translate()(Time);