import React from 'react';

import { storiesOf } from '@storybook/react';

import Receipt from '../routes/app/voter/vote/components/Receipt';

storiesOf('Receipts', module).add('voting receipt', () => <Receipt />);
