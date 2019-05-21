import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Text from 'components/text';
import Link from 'components/link';
import { Date } from 'components/i18n';
import { PageSubSection } from 'components/page';
import { InfoList, InfoListItem } from 'components/infolist';
import { allEqualForAttrs } from 'utils';
import { Election, ElectionGroup } from 'interfaces';

const valueNotSet = (
  <b>
    <Trans>election.valueNotSet</Trans>
  </b>
);

const mandatePeriodSingle = (election: Election) => {
  const startDate = election.mandatePeriodStart ? (
    <Date dateTime={election.mandatePeriodStart} longDate />
  ) : (
    valueNotSet
  );
  const endDate = election.mandatePeriodEnd ? (
    <Date dateTime={election.mandatePeriodEnd} longDate />
  ) : (
    valueNotSet
  );
  return (
    <span>
      {startDate}&nbsp;<Trans>general.to</Trans>&nbsp;{endDate}
    </span>
  );
};

const mandatePeriodMultiple = (elections: Array<Election>, lang: string) => (
  <InfoList>
    {elections.map((election: any, index: any) => {
      return (
        <InfoListItem key={index} bulleted>
          {election.name[lang]}:{' '}
          <Text bold inline>
            <Date dateTime={election.mandatePeriodStart} longDate />
            &nbsp;<Trans>general.to</Trans>&nbsp;
            <Date dateTime={election.mandatePeriodEnd} longDate />
          </Text>
        </InfoListItem>
      );
    })}
  </InfoList>
);

const contactSingle = (election: Election) => {
  const contact = election.contact ? (
    <Link mail to={election.contact}>
      {election.contact}
    </Link>
  ) : (
    valueNotSet
  );
  return contact;
};

const contactMultiple = (elections: Array<Election>, lang: string) => (
  <InfoList>
    {elections.map((election: any, index: any) => {
      const contact = election.contact ? (
        <Link mail to={election.contact}>
          {election.contact}
        </Link>
      ) : (
        valueNotSet
      );
      return (
        <InfoListItem key={index} bulleted>
          {election.name[lang]}: {contact}
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
  return informationUrl;
};

const informationUrlMultiple = (elections: Array<Election>, lang: string) => (
  <InfoList>
    {elections.map((election: any, index: any) => {
      const informationUrl = election.informationUrl ? (
        <Link external to={election.informationUrl}>
          {election.informationUrl}
        </Link>
      ) : (
        valueNotSet
      );
      return (
        <InfoListItem key={index} bulleted>
          {election.name[lang]}: {informationUrl}
        </InfoListItem>
      );
    })}
  </InfoList>
);

interface IProps {
  electionGroup: ElectionGroup;
  elections: Array<Election>;
}

const VoterInfoValues: React.FunctionComponent<IProps> = (props: IProps) => {
  const { elections } = props;
  const electionGroup: any = props.electionGroup;
  const { i18n } = useTranslation();
  const lang = i18n.language;
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
    mandatePeriodInfo = <p>{mandatePeriodSingle(elections[0])}</p>;
    contact = <p>{contactSingle(elections[0])}</p>;
    informationUrl = <p>{informationUrlSingle(elections[0])}</p>;
  } else {
    if (
      elections.length > 1 && // to not present the value as "shared" if there
      // is only one active election
      allEqualForAttrs(elections, ['mandatePeriodStart', 'mandatePeriodEnd'])
    ) {
      mandatePeriodInfo = (
        <p>
          <Trans>election.mandatePeriodShared</Trans>:{' '}
          <Text bold inline>
            {mandatePeriodSingle(elections[0])}
          </Text>
        </p>
      );
    } else {
      mandatePeriodInfo = mandatePeriodMultiple(elections, lang);
    }
    if (elections.length > 1 && allEqualForAttrs(elections, ['contact'])) {
      contact = (
        <p>
          <Trans>election.voterContactInfoShared</Trans>:{' '}
          {contactSingle(elections[0])}
        </p>
      );
    } else {
      contact = contactMultiple(elections, lang);
    }
    if (
      elections.length > 1 &&
      allEqualForAttrs(elections, ['informationUrl'])
    ) {
      informationUrl = (
        <p>
          <Trans>election.voterInfoUrlShared</Trans>:{' '}
          {informationUrlSingle(elections[0])}
        </p>
      );
    } else {
      informationUrl = informationUrlMultiple(elections, lang);
    }
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

export default VoterInfoValues;
