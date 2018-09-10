import * as React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import PrimaryButton from './PrimaryButton';


storiesOf('form.button.Primarybutton', module)
  .add('with text', () => (
    <PrimaryButton action={action('clicked')} text="Noe tekst"/>
  ));
