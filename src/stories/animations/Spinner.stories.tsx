import React from 'react';

import { storiesOf } from '@storybook/react';

import Spinner from '../../components/animations/Spinner';

storiesOf('Animations', module)
  .add('Spinner darkStyle', () => <Spinner darkStyle />)
  .add('Spinner on dark background', () => (
    <div style={{ background: 'black' }}>
      <Spinner />
    </div>
  ));
