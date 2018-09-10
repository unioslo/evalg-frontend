/* @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import { Trans } from 'react-i18next';;
import { Page, PageSection } from 'components/page';
import VoterElections from './components/VoterElections';


import { objPropsToArray } from 'utils';

type Props = {
  lang: string,
  getElectionGroups: Function,
  getElectionGroupElections: Function,
  electionGroups: Object,
  elections: Object
}

type State = {
  doneLoading: boolean
}

class VoterFrontPage extends React.Component {
  state: State;
  props: Props;

  constructor(props) {
    super(props);
    this.state = { doneLoading: false }
  }
  componentDidMount() {
    const { getElectionGroups, getElectionGroupElections } = this.props;
    const promises = [];
    promises.push(getElectionGroups().then(
      (groupsAction) => {
        const groups = objPropsToArray(groupsAction.response);
        groups.forEach(group => {
          promises.push(getElectionGroupElections(group.id).then(
            () => {
              Promise.all(promises).then(
                () => {
                  this.setState({ doneLoading: true })
                })
            }
          ));
        })
      }
    ))
  }
  render() {
    if (!this.state.doneLoading) {
      return null;
    }
    const { electionGroups, elections } = this.props;
    const groups = objPropsToArray(electionGroups);
    return (
      <Page header={<Trans>general.welcome</Trans>}>
        <PageSection desc={<Trans>general.frontPageDesc</Trans>}>
          <VoterElections electionGroups={groups}
            elections={elections}
          />
        </PageSection>
      </Page>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.i18n.lang,
    electionGroups: state.voterElectionGroups.items,
    elections: state.voterElections.items
  }
};

export default connect(mapStateToProps, {
  getElectionGroups: getVoterElectionGroups, getElectionGroupElections
})(VoterFrontPage);