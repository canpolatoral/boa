import React from 'react';
import { assert } from 'chai';
import Label from './Label';
import { context, createShallow, createMount } from '../../../test/utils';

describe('<Label /> tests', () => {
  let mount;
  let shallow;

  before(() => {
    mount = createMount();
    shallow = createShallow({ dive: true });
  });

  after(() => {
    mount.cleanUp();
  });

  it('should render a label inside div', () => {
    const wrapper = shallow(<Label context={context} text="Test" />);
    assert.strictEqual(wrapper.type(), 'div');
    assert.strictEqual(wrapper.childAt(0).type(), 'label');
    assert.strictEqual(wrapper.childAt(0).text(), 'Test');
  });

  it('should mount', () => {
    const wrapper = mount(<Label context={context} text="Test" maxWidth={50} />);
    assert.strictEqual(wrapper.text(), 'Test');
  });

  it('shuold support minFontSize', () => {
    const wrapper = shallow((
      <Label
        minFontSize={15}
        context={context}
        text="Test" />
    ));
    assert.strictEqual(wrapper.find('div').props().style.fontSize, 15);
  });

  it('shuold support maxFontSize', () => {
    const wrapper = shallow((
      <Label
        maxFontSize={10}
        context={context}
        text="Test" />
    ));
    assert.strictEqual(wrapper.find('div').props().style.fontSize, 10);
  });

  it('shuold support maxWidth', () => {
    const wrapper = shallow((
      <Label
        maxWidth={10}
        context={context}
        text="Test" />
    ));
    assert.strictEqual(wrapper.find('div').props().style.width, 10);
  });

  it('shuold support textAlign', () => {
    const wrapper = shallow((
      <Label
        textAlign="center"
        context={context}
        text="Test" />
    ));
    assert.strictEqual(wrapper.find('div').props().style.textAlign, 'center');
  });

  it('shuold support RTL', () => {
    const newContext = Object.assign({}, context,
      {
        languageId: 5,
        localization: {
          isRightToLeft: true,
        },
      });
    const wrapper = shallow((
      <Label
        maxWidth={10}
        context={newContext}
        text="Test" />
    ));
    assert.strictEqual(wrapper.find('div').props().style.width, 10);
    assert.strictEqual(wrapper.find('div').props().style.textAlign, 'right');
  });
});
