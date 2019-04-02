import React from 'react';

import { storiesOf } from '@storybook/react';

import Error from '../routes/app/voter/vote/components/Error';

storiesOf('Errors', module).add('voting error', () => <Error />);
