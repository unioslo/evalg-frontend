import React from 'react';
import { mount, shallow } from 'enzyme';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

chai.use(chaiEnzyme());
const expect = chai.expect;

import CloseIcon from './CloseIcon';

describe('<CloseIcon />', () => {
  it('should have a closeAction prop', () => null);
  it('should call closeAction prop on click', () => null);
});
