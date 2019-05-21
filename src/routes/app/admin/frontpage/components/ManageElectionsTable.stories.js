import React from 'react';
import { storiesOf } from '@kadira/storybook';

import electionGroups from 'test/mockData/adminElectionGroups';

import ManageElectionsTable from './ManageElectionsTable';

storiesOf('table.ManageElectionsTable', module)
  .add('No elections', () => <ManageElectionsTable electionGroups={{}} />)
  .add('With elections', () => (
    <ManageElectionsTable electionGroups={electionGroups} />
  ));
