import React from 'react';
import { mount, shallow } from 'enzyme';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

chai.use(chaiEnzyme());
const { expect } = chai;

import Modal from './Modal';
import CloseIcon from './icons/CloseIcon';

describe('<Modal />', () => {
  it('should close when close icon is clicked', () => null);
  it('should render child appropriatly', () => null);
  it('should render buttons appropriatly', () => null);
});
