/* @flow */
import * as React from 'react';
import { connect } from 'react-redux';

import Text from 'components/text';
import Link from 'components/link';
import { Trans } from 'react-i18next';
import { InfoList, InfoListItem } from 'components/infolist';
import { PageSection } from 'components/page';
import CreateElectionKey from './CreateElectionKey';

type Props = {
  electionGroup: ElectionGroup,
  lang: string,
};

class ElectionKeySection extends React.Component<Props> {
  render() {
    const { electionGroup } = this.props;
    const hasKey = electionGroup.publicKey !== null;

    return (
      <PageSection header={<Trans>election.electionKey</Trans>}>
        {!hasKey &&
          <div>
            <Text>
              <Trans>election.electionKeyMissing</Trans>
            </Text>
            <CreateElectionKey electionGroup={electionGroup} />
          </div>}
        {hasKey &&
          <div>
            <Text>
              <Trans>election.electionKeyExists</Trans>
            </Text>
            <InfoList>
              <InfoListItem bulleted key="keep-it-safe">
                <Trans>election.electionKeyStatusKeepItSafe</Trans>
              </InfoListItem>
              <InfoListItem bulleted key="can-replace">
                <Trans>election.electionKeyStatusCanReplace</Trans>
              </InfoListItem>
              <InfoListItem bulleted key="read-more">
                <Link external to="#TODO">
                  <Trans>election.electionKeyReadMore</Trans>
                </Link>
              </InfoListItem>
            </InfoList>
          </div>
        }
      </PageSection>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.i18n.lang
  }
};

export default connect(mapStateToProps)(ElectionKeySection);
