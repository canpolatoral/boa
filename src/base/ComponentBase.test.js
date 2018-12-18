import React from 'react';
import { expect, assert } from 'chai';
import sinon from 'sinon';
import ComponentBase from './ComponentBase';
import Context from '../../test/utils/context';
import { createShallow, createMount } from '../../test/utils';

function serviceCallSync(request, versions, messages) {
  if (typeof versions === 'boolean' && versions === false) {
    request.error();
  } else if (request.url.includes('Version')) {
    request.success(versions);
  } else {
    request.success(messages);
  }
}

/* eslint-disable-next-line */
class EmptyComponent extends ComponentBase {
  state = {
    snapshotProperty: 'EmptyComponent',
  }

  render() {
    return (
      <div>
        {this.state.snapshotProperty}
      </div>
    );
  }
}

describe('<ComponentBase /> tests', () => {
  let shallow;
  let mount;

  before(() => {
    shallow = createShallow();
    mount = createMount();
  });

  it('should render', () => {
    const wrapper = shallow(<EmptyComponent />);
    expect(wrapper.text()).contains('EmptyComponent');
  });

  it('should render with snapshot', () => {
    const wrapper = shallow((
      <EmptyComponent snapshot={{ snapshotProperty: 'TestSnapshot' }} />
    ));
    expect(wrapper.text()).contains('TestSnapshot');
  });

  it('should handle change snapshot prop', () => {
    const wrapper = mount((
      <EmptyComponent snapshot={{ snapshotProperty: 'TestSnapshot' }} />
    ));
    wrapper.setProps({ snapshot: { snapshotProperty: 'ChangedSnapshot' } });
    expect(wrapper.instance().getSnapshot().snapshotProperty).equals('ChangedSnapshot');
  });

  it('should getSnapkey', () => {
    const wrapper = mount((
      <EmptyComponent snapKey="snapKey" />
    ));
    assert.strictEqual(wrapper.instance().getSnapKey('child'), 'snapKey_child');
  });

  it('should getInstance', () => {
    const wrapper = mount((
      <EmptyComponent />
    ));
    assert.strictEqual(wrapper.instance(), wrapper.instance().getInstance());
  });

  it('should getMessage', () => {
    const wrapper = mount((
      <EmptyComponent context={Context} />
    ));

    const versions = [{ id: 1, name: 'test', ClassName: 'test', Version: 1 }];
    const messages = [
      {
        Code: 'code',
        Description: 'test',
        GroupName: 'test',
        LanguageId: 1,
        PropertyName: 'test',
      }];

    // eslint-disable-next-line
    const stub = sinon.stub($, 'ajax').callsFake((request) => {
      return serviceCallSync(request, versions, messages);
    });
    assert.strictEqual(wrapper.instance().getMessage('test', 'test'), 'test');
    assert.strictEqual(wrapper.instance().getMessageCode('test', 'test'), 'code');
    stub.restore();
  });

  it('should validateConstraint', () => {
    const wrapper = mount((
      <EmptyComponent context={Context} />
    ));
    assert.strictEqual(wrapper.instance().validateConstraint(), true);
  });
});
