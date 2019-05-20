import React from 'react';
import { storiesOf } from '@kadira/storybook';

import ManageElectionsTable from './ManageElectionsTable';
import electionGroups from '../../../../../test/mockData/adminElectionGroups';


storiesOf('table.ManageElectionsTable', module)
  .add('No elections', () => (
    <ManageElectionsTable electionGroups={{}} />
  ))
  .add('With elections', () => (
    <ManageElectionsTable electionGroups={electionGroups} />
  ));
