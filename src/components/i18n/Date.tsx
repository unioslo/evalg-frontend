import * as React from 'react';
import { useTranslation } from 'react-i18next';
import moment, { Moment } from 'moment-timezone';
import 'moment/locale/nb';
import { appTimezone } from '../../appConfig';

interface IProps {
  dateTime: Moment | string;
  longDate: boolean;
}

const Date: React.FunctionComponent<IProps> = (props: IProps) => {
  const { i18n, t } = useTranslation();

  if (!props.dateTime) {
    return <span>{t('election.valueNotSet')}</span>;
  }
  moment.locale(i18n.language);
  const date = props.longDate
    ? moment.tz(props.dateTime, appTimezone).format('LL')
    : moment.tz(props.dateTime, appTimezone).format('L');
  return <span>{date}</span>;
};

export default Date;
