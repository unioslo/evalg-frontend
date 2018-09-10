import * as React from 'react';
import { mount, shallow } from 'enzyme';
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

chai.use(chaiEnzyme());
const expect = chai.expect;

import PrimaryButton from './PrimaryButton';

describe('<PrimaryButton />', () => {
  it('should call the button action function when clicked', () => {
    const onButtonClick = sinon.spy();
    const wrapper = shallow(
      <PrimaryButton
        action={onButtonClick}
        text={'test'}
      />);
    wrapper.find('button').simulate('click');
    expect(onButtonClick.calledOnce).to.equal(true);
  });
  it('should render the text prop of the button', () => {
    const testString = 'this is my PrimaryButton there are many like it but this one is mine';
    const wrapper = shallow(
      <PrimaryButton
        action={() => 1}
        text={testString}
      />);
    expect(wrapper.find('span').text()).to.equal(testString);
  });
  it('should have the CSS class .primarybutton', () => {
    const wrapper = shallow(
      <PrimaryButton />);
    expect(wrapper).to.have.className('primarybutton');
  });
  it('should have the CSS class .primarybutton--text on the text content', () => {
    const wrapper = shallow(
      <PrimaryButton />);
    expect(wrapper.find('span')).to.have.className('primarybutton--text');
  });
});
