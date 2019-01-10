import React from 'react';
import { assert } from 'chai';
import { spy } from 'sinon';
import ButtonBase from '@material-ui/core/ButtonBase';
import DayButton from './DayButton';
import { isEqualDate, getDatePickerStyle, DayType } from './dateUtils';
import { context, createShallow, createMount } from '../../../test/utils';

describe('<DayButton />', () => {
  let shallow;
  let mount;

  before(() => {
    shallow = createShallow();
    mount = createMount({ includeBOAcontext: false });
  });

  after(() => {
    mount.cleanUp();
  });

  it('should render a empty span when date not specified', () => {
    const wrapper = shallow(<DayButton context={context} />);
    assert.strictEqual(wrapper.type(), 'span');
  });

  it('should render a ButtonBase', () => {
    const date = new Date();
    const displayDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const wrapper = shallow(<DayButton context={context} date={displayDate} />);
    assert.strictEqual(wrapper.type(), ButtonBase);
  });

  it('should render a span inside button', () => {
    const date = new Date();
    const displayDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const wrapper = shallow(<DayButton context={context} date={displayDate} />);
    assert.strictEqual(wrapper.childAt(1).type(), 'span');
  });

  describe('prop:isBusiness', () => {
    const datePickerStyle = getDatePickerStyle(context);
    it('should render WorkDay', () => {
      const date = new Date();
      const wrapper = shallow((
        <DayButton
          context={context}
          date={date}
          isBusiness
          dayInfo={{ dayType: DayType.WorkDay }} />
      ));
      const divStyle = wrapper.childAt(0).props().style;
      const spanStyle = wrapper.childAt(1).props().style;

      assert.strictEqual(divStyle.backgroundColor, datePickerStyle.todayButtonBackgroundColor);
      assert.strictEqual(divStyle.opacity, 1);
      assert.strictEqual(spanStyle.color, '#FFFFFF');
    });
  });

  describe('simulate events', () => {
    describe('onMouseEnter', () => {
      it('should change state to hovered', () => {
        const date = new Date();
        const displayDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const wrapper = shallow(<DayButton context={context} date={displayDate} />);
        wrapper.simulate('mouseEnter');
        assert.strictEqual(wrapper.state().hover, true);
      });

      it('should not change state to hovered when disabled', () => {
        const date = new Date();
        const displayDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const wrapper = shallow(<DayButton context={context} disabled date={displayDate} />);
        wrapper.simulate('mouseEnter');
        assert.strictEqual(wrapper.state().hover, false);
      });
    });

    describe('onMouseLeave', () => {
      it('should change state to not hovered', () => {
        const date = new Date();
        const displayDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const wrapper = shallow(<DayButton context={context} date={displayDate} />);
        wrapper.setState({ hover: true });
        wrapper.simulate('mouseLeave');
        assert.strictEqual(wrapper.state().hover, false);
      });

      it('should not change state to not hovered when disabled', () => {
        const date = new Date();
        const displayDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const wrapper = shallow(<DayButton context={context} disabled date={displayDate} />);
        wrapper.setState({ hover: true });
        wrapper.simulate('mouseLeave');
        assert.strictEqual(wrapper.state().hover, true);
      });
    });

    describe('onTouchTap', () => {
      it('should fire onTouchTap', () => {
        const date = new Date();
        const displayDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const onTouchTap = spy();
        const wrapper = shallow((
          <DayButton
            context={context}
            onTouchTap={onTouchTap}
            date={displayDate} />
        ));
        wrapper.find(ButtonBase).simulate('click');
        assert.strictEqual(onTouchTap.callCount, 1);
      });

      it('should not fire onTouchTap when disabled', () => {
        const date = new Date();
        const displayDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const onTouchTap = spy();
        const wrapper = shallow((
          <DayButton
            context={context}
            disabled
            onTouchTap={onTouchTap}
            date={displayDate} />
        ));
        wrapper.find(ButtonBase).simulate('click');
        assert.strictEqual(onTouchTap.callCount, 0);
      });
    });
  });
});
