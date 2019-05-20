import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import NextButton from './NextButton';

storiesOf('button.NextButton', module).add('with text', () => (
  <NextButton action={action('clicked')} text="Neste" />
));
