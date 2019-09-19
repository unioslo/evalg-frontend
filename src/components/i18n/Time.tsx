import React from 'react';
import { useTranslation } from 'react-i18next';
import moment, { Moment } from 'moment-timezone';
import { appTimezone } from 'appConfig';

interface IProps {
  dateTime: Moment | string;
}

const prefixes: { [id: string]: string } = {
  en: 'at',
  nb: 'kl',
  nn: 'kl',
};

const Time: React.FunctionComponent<IProps> = (props: IProps) => {
  const { i18n, t } = useTranslation();

  if (!props.dateTime) {
    return <span>{t('election.valueNotSet')}</span>;
  }
  moment.locale(i18n.language);
  const lang = i18n.language;
  const time = moment.tz(props.dateTime, appTimezone).format('LT');
  const prefix: string = (prefixes[lang] !== undefined ? prefixes[lang] : 'kl')

  return <span>{`${prefix} ${time}`}</span>;
};

export default Time;
