/* @flow */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import moment, { Moment } from 'moment-timezone';
import { appTimezone } from '../../appConfig';

interface IProps {
  dateTime: Moment | string;
}

const prefixes: any = {
  en: 'at',
  nb: 'kl',
};

export default function Time(props: IProps) {
  const { i18n, t } = useTranslation();

  if (!props.dateTime) {
    return <span>{t('election.valueNotSet')}</span>;
  }
  moment.locale(i18n.language);
  const lang = i18n.language;
  const time = moment.tz(props.dateTime, appTimezone).format('LT');
  return <span>{`${prefixes[lang]} ${time}`}</span>;
}
