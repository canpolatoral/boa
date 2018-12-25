import React from 'react';
import { spy } from 'sinon';
import { assert, expect } from 'chai';
import EventListener from 'react-event-listener';
import Calendar from './Calendar';
import { context, createShallow } from '../../../test/utils';

describe('<Calendar /> tests', () => {
  let shallow;

  before(() => {
    shallow = createShallow();
  });

  it('should component will receive props', () => {
    const wrapper = shallow(<Calendar context={context} style={{}} />);
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    wrapper.setProps({ dialogNewSelectDate: date, initialDate: date });
    assert.strictEqual(wrapper.state().selectedDate, date);
    assert.strictEqual(wrapper.instance().getSelectedDate(), date);
  });

  describe('should handle key events', () => {
    let wrapper;
    let eventListener;
    const dateUpdate = spy();

    before(() => {
      wrapper = shallow((
        <Calendar dateUpdate={dateUpdate} open context={context} style={{}} />
      ));
      eventListener = wrapper.find(EventListener);
    });

    beforeEach(() => {
      dateUpdate.resetHistory();
    });

    it('should decrease year with up + alt + shift', () => {
      const oldDate = wrapper.state().selectedDate;
      const newDate = new Date(oldDate.getTime());
      newDate.setFullYear(oldDate.getFullYear() - 1);

      eventListener.simulate('keyDown', {
        keyCode: 38,
        key: 'up',
        altKey: true,
        shiftKey: true,
      });

      expect(dateUpdate).to.have.property('callCount', 1);
      assert.strictEqual(dateUpdate.args[0][0].getTime(), oldDate.getTime());
      assert.strictEqual(dateUpdate.args[0][1].getTime(), newDate.getTime());
    });

    it('should decrease month with up + shift', () => {
      const oldDate = wrapper.state().selectedDate;
      const newDate = new Date(oldDate.getTime());
      newDate.setMonth(oldDate.getMonth() - 1);

      eventListener.simulate('keyDown', {
        keyCode: 38,
        key: 'up',
        shiftKey: true,
      });

      expect(dateUpdate).to.have.property('callCount', 1);
      assert.strictEqual(dateUpdate.args[0][0].getTime(), oldDate.getTime());
      assert.strictEqual(dateUpdate.args[0][1].getTime(), newDate.getTime());
    });

    it('should decrease days with up + alt', () => {
      const oldDate = wrapper.state().selectedDate;
      const newDate = new Date(oldDate.getTime());
      newDate.setDate(oldDate.getDate() - 7);

      eventListener.simulate('keyDown', {
        keyCode: 38,
        key: 'up',
        altKey: true,
      });

      expect(dateUpdate).to.have.property('callCount', 1);
      assert.strictEqual(dateUpdate.args[0][0].getTime(), oldDate.getTime());
      assert.strictEqual(dateUpdate.args[0][1].getTime(), newDate.getTime());
    });

    it('should increase year with down + alt + shift', () => {
      const oldDate = wrapper.state().selectedDate;
      const newDate = new Date(oldDate.getTime());
      newDate.setFullYear(oldDate.getFullYear() + 1);

      eventListener.simulate('keyDown', {
        keyCode: 40,
        key: 'down',
        altKey: true,
        shiftKey: true,
      });
      expect(dateUpdate).to.have.property('callCount', 1);
      assert.strictEqual(dateUpdate.args[0][0].getTime(), oldDate.getTime());
      assert.strictEqual(dateUpdate.args[0][1].getTime(), newDate.getTime());
    });

    it('should increase month with down + shift', () => {
      const oldDate = wrapper.state().selectedDate;
      const newDate = new Date(oldDate.getTime());
      newDate.setMonth(oldDate.getMonth() + 1);

      eventListener.simulate('keyDown', {
        keyCode: 40,
        key: 'down',
        shiftKey: true,
      });

      expect(dateUpdate).to.have.property('callCount', 1);
      assert.strictEqual(dateUpdate.args[0][0].getTime(), oldDate.getTime());
      assert.strictEqual(dateUpdate.args[0][1].getTime(), newDate.getTime());
    });

    it('should increase days with down + alt', () => {
      const oldDate = wrapper.state().selectedDate;
      const newDate = new Date(oldDate.getTime());
      newDate.setDate(oldDate.getDate() + 7);

      eventListener.simulate('keyDown', {
        keyCode: 40,
        key: 'down',
        altKey: true,
      });

      expect(dateUpdate).to.have.property('callCount', 1);
      assert.strictEqual(dateUpdate.args[0][0].getTime(), oldDate.getTime());
      assert.strictEqual(dateUpdate.args[0][1].getTime(), newDate.getTime());
    });

    it('should decrease year with left + alt + shift', () => {
      const oldDate = wrapper.state().selectedDate;
      const newDate = new Date(oldDate.getTime());
      newDate.setFullYear(oldDate.getFullYear() - 1);

      eventListener.simulate('keyDown', {
        keyCode: 37,
        key: 'left',
        altKey: true,
        shiftKey: true,
      });

      expect(dateUpdate).to.have.property('callCount', 1);
      assert.strictEqual(dateUpdate.args[0][0].getTime(), oldDate.getTime());
      assert.strictEqual(dateUpdate.args[0][1].getTime(), newDate.getTime());
    });

    it('should decrease month with left + shift', () => {
      const oldDate = wrapper.state().selectedDate;
      const newDate = new Date(oldDate.getTime());
      newDate.setMonth(oldDate.getMonth() - 1);

      eventListener.simulate('keyDown', {
        keyCode: 37,
        key: 'left',
        shiftKey: true,
      });

      expect(dateUpdate).to.have.property('callCount', 1);
      assert.strictEqual(dateUpdate.args[0][0].getTime(), oldDate.getTime());
      assert.strictEqual(dateUpdate.args[0][1].getTime(), newDate.getTime());
    });

    it('should decrease days with left + alt', () => {
      const oldDate = wrapper.state().selectedDate;
      const newDate = new Date(oldDate.getTime());
      newDate.setDate(oldDate.getDate() - 1);

      eventListener.simulate('keyDown', {
        keyCode: 37,
        key: 'left',
        altKey: true,
      });

      expect(dateUpdate).to.have.property('callCount', 1);
      assert.strictEqual(dateUpdate.args[0][0].getTime(), oldDate.getTime());
      assert.strictEqual(dateUpdate.args[0][1].getTime(), newDate.getTime());
    });

    it('should increase year with right + alt + shift', () => {
      const oldDate = wrapper.state().selectedDate;
      const newDate = new Date(oldDate.getTime());
      newDate.setFullYear(oldDate.getFullYear() + 1);

      eventListener.simulate('keyDown', {
        keyCode: 39,
        key: 'right',
        altKey: true,
        shiftKey: true,
      });
      expect(dateUpdate).to.have.property('callCount', 1);
      assert.strictEqual(dateUpdate.args[0][0].getTime(), oldDate.getTime());
      assert.strictEqual(dateUpdate.args[0][1].getTime(), newDate.getTime());
    });

    it('should increase month with right + shift', () => {
      const oldDate = wrapper.state().selectedDate;
      const newDate = new Date(oldDate.getTime());
      newDate.setMonth(oldDate.getMonth() + 1);

      eventListener.simulate('keyDown', {
        keyCode: 39,
        key: 'right',
        shiftKey: true,
      });

      expect(dateUpdate).to.have.property('callCount', 1);
      assert.strictEqual(dateUpdate.args[0][0].getTime(), oldDate.getTime());
      assert.strictEqual(dateUpdate.args[0][1].getTime(), newDate.getTime());
    });

    it('should increase days with right + alt', () => {
      const oldDate = wrapper.state().selectedDate;
      const newDate = new Date(oldDate.getTime());
      newDate.setDate(oldDate.getDate() + 1);

      eventListener.simulate('keyDown', {
        keyCode: 39,
        key: 'right',
        altKey: true,
      });

      expect(dateUpdate).to.have.property('callCount', 1);
      assert.strictEqual(dateUpdate.args[0][0].getTime(), oldDate.getTime());
      assert.strictEqual(dateUpdate.args[0][1].getTime(), newDate.getTime());
    });
  });

  // it('should setValue, getValue, resetValue', () => {
  //   const wrapper = shallow(<Calendar context={context} />).dive();
  //   const input = wrapper.shallow();
  //   assert.strictEqual(input.instance().getValue(), false);
  //   input.instance().setValue(true);
  //   assert.strictEqual(input.instance().getValue(), true);
  //   input.instance().resetValue();
  //   assert.strictEqual(input.instance().getValue(), false);
  // });
});
