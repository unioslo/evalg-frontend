import * as React from 'react';
import { Trans } from 'react-i18next';

import { Date } from 'components/i18n';

interface IProps {
  election: Election
}

const MandatePeriodText: React.SFC<IProps> = props => (
  <>
    <Trans>election.mandatePeriod</Trans>:&nbsp;
    <Date dateTime={props.election.mandatePeriodStart} longDate />&nbsp;-&nbsp;
    <Date dateTime={props.election.mandatePeriodEnd} longDate />
  </>
);

export default MandatePeriodText;