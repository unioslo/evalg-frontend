import * as React from 'react';
import { mount, shallow } from 'enzyme';
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme';
import configureStore from 'redux-mock-store';
chai.use(chaiEnzyme());
const expect = chai.expect;
const noop = () => null;

import Header from './Header';

const mockStore = configureStore();
const store = mockStore({ i18n: { lang: 'nb' } });

describe('<Header>', function () {
  it('should have the css-class .header', function () {
    const wrapper = shallow(<Header store={store} />, { context: { t: noop } });
    expect(wrapper).to.have.className('header');
  })
});
