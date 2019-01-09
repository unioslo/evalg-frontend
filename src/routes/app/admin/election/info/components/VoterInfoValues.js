/* @flow */
import * as React from 'react';

import { Date } from 'components/i18n';
import { Trans, translate } from 'react-i18next';
import Link from 'components/link';

import { PageSection, PageSubSection } from 'components/page';
import { InfoList, InfoListItem } from 'components/infolist';

const valueNotSet = (
  <b>
    <Trans>election.valueNotSet</Trans>
  </b>
);

const mandatePeriodSingle = (election: Election) => {
  const startDate = election.mandatePeriodStart ? (
    <Date date={election.mandatePeriodStart} />
  ) : (
    valueNotSet
  );
  const endDate = election.mandatePeriodEnd ? (
    <Date date={election.mandatePeriodEnd} />
  ) : (
    valueNotSet
  );
  return (
    <p>
      <Trans>general.to</Trans>&nbsp;{endDate}
    </p>
  );
};

const mandatePeriodMultiple = (elections: Array<Election>, lang: string) => {
  return (
    <InfoList>
      {elections.map((election, index) => {
        return (
          <InfoListItem key={index} bulleted>
            {election.name[lang]} -&nbsp;
            <Date dateTime={election.mandatePeriodStart} />
            &nbsp;<Trans>general.to</Trans>&nbsp;
            <Date dateTime={election.mandatePeriodEnd} />
          </InfoListItem>
        );
      })}
    </InfoList>
  );
};

const contactSingle = (election: Election) => {
  const contact = election.contact ? (
    <Link external to={`mailto:${election.contact}`}>
      {election.contact}
    </Link>
  ) : (
    valueNotSet
  );
  return <p>{contact}</p>;
};

const contactMultiple = (elections: Array<Election>, lang: string) => (
  <InfoList>
    {elections.map((election, index) => {
      const contact = election.contact ? (
        <Link external to={`mailto:${election.contact}`}>
          {election.contact}
        </Link>
      ) : (
        valueNotSet
      );
      return (
        <InfoListItem key={index} bulleted>
          {election.name[lang]} - {contact}
        </InfoListItem>
      );
    })}
  </InfoList>
);

const informationUrlSingle = (election: Election) => {
  const informationUrl = election.informationUrl ? (
    <Link external to={election.informationUrl}>
      {election.informationUrl}
    </Link>
  ) : (
    valueNotSet
  );
  return <p>{informationUrl}</p>;
};

const informationUrlMultiple = (elections: Array<Election>, lang: string) => (
  <InfoList>
    {elections.map((election, index) => {
      const informationUrl = election.informationUrl ? (
        <Link external to={election.informationUrl}>
          {election.informationUrl}
        </Link>
      ) : (
        valueNotSet
      );
      return (
        <InfoListItem key={index} bulleted>
          {election.name[lang]} - {informationUrl}
        </InfoListItem>
      );
    })}
  </InfoList>
);

type Props = {
  electionGroup: ElectionGroup,
  elections: Array<Election>,
  active: boolean,
  setActive: Function,
  header: ReactElement | string,
  i18n: Object,
};

const VoterInfoValues = (props: Props) => {
  const { electionGroup, elections, active, setActive, header } = props;
  const lang = props.i18n.language;
  let mandatePeriodInfo = null;
  let contact = null;
  let informationUrl = null;

  if (elections.length === 0) {
    mandatePeriodInfo = (
      <p>
        <Trans>election.noActiveElections</Trans>
      </p>
    );
    contact = (
      <p>
        <Trans>election.noActiveElections</Trans>
      </p>
    );
    informationUrl = (
      <p>
        <Trans>election.noActiveElections</Trans>
      </p>
    );
  } else if (electionGroup.type === 'single_election') {
    mandatePeriodInfo = mandatePeriodSingle(elections[0]);
    contact = contactSingle(elections[0]);
    informationUrl = informationUrlSingle(elections[0]);
  } else {
    mandatePeriodInfo = mandatePeriodMultiple(elections, lang);
    contact = contactMultiple(elections, lang);
    informationUrl = informationUrlMultiple(elections, lang);
  }

  return (
    <React.Fragment>
      <PageSubSection header={<Trans>election.election</Trans>}>
        <p>{electionGroup.name[lang]}</p>
      </PageSubSection>

      <PageSubSection header={<Trans>election.mandatePeriod</Trans>}>
        {mandatePeriodInfo}
      </PageSubSection>

      <PageSubSection header={<Trans>election.voterContactInfo</Trans>}>
        {contact}
      </PageSubSection>

      <PageSubSection header={<Trans>election.voterInfoUrl</Trans>}>
        {informationUrl}
      </PageSubSection>
    </React.Fragment>
  );
};

export default translate()(VoterInfoValues);
