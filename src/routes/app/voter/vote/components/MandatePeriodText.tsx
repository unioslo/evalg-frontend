import React from 'react';
import { Trans } from 'react-i18next';

import { Date } from 'components/i18n';
import { Election } from 'interfaces';

interface IProps {
  election: Election;
  longDate?: boolean;
}

const MandatePeriodText: React.SFC<IProps> = props => {
  const longDate = props.longDate ? props.longDate : false;

  return (
    <>
      <Trans>election.mandatePeriod</Trans>:&nbsp;
      <Date
        dateTime={props.election.mandatePeriodStart}
        longDate={longDate}
      />{' '}
      - <Date dateTime={props.election.mandatePeriodEnd} longDate={longDate} />
    </>
  );
};

export default MandatePeriodText;
