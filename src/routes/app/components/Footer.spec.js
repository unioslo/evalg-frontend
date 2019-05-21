import React from 'react';
import { mount, shallow } from 'enzyme';
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme';
chai.use(chaiEnzyme());
const expect = chai.expect;
const noop = () => null;

import Footer from './Footer';

describe('<Footer>', function () {
  it('should have the css-class .footer--wrapper', function () {
    const wrapper = shallow(<Footer />, { context: { t: noop } });
    expect(wrapper).to.have.className('footer--wrapper')
  })
});
