import * as React from 'react';
import { Trans } from 'react-i18next';

import { Date } from 'components/i18n';

interface IProps {
  election: Election
}

const MandatePeriodText: React.SFC<IProps> = props => (
  <>
    <Trans>election.mandatePeriod</Trans>:&nbsp;
    <Date dateTime={props.election.mandatePeriodStart} /> -&nbsp;
    <Date dateTime={props.election.mandatePeriodEnd} />
  </>
);

export default MandatePeriodText;