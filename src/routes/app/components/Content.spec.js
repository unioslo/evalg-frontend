/* eslint-disable */
import React from 'react';
import { mount, shallow } from 'enzyme';
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme';
chai.use(chaiEnzyme());
const { expect } = chai;

import Content from './Content';

describe('<Content>', function() {
  it('should have the css-class .content--wrapper', function() {
    const wrapper = shallow(<Content />);
    expect(wrapper).to.have.className('content--wrapper');
  })
});
