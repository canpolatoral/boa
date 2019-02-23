import { assert } from 'chai';
import {
  formatIso,
  getMonthName,
  addHours,
  addMinutes,
  addSeconds,
  cloneDate,
  isEqualDateTime,
  isEqualDate,
} from './dateUtils';

describe('dateUtils', () => {
  it('formatIso length', () => {
    const isoFormatedDate = formatIso(new Date());
    assert.strictEqual(isoFormatedDate.length, 10);
  });

  it('getMonthName', () => {
    const monthName = getMonthName(4);
    assert.strictEqual(monthName, 'May');
  });

  it('addHours', () => {
    const date = new Date();
    const added = 3;
    const addedDate = addHours(date, added);
    assert.strictEqual(addedDate.getHours() % 24, (date.getHours() + added) % 24);
  });

  it('addMinutes', () => {
    const date = new Date();
    const added = 3;
    const addedDate = addMinutes(date, added);
    assert.strictEqual(addedDate.getMinutes() % 60, (date.getMinutes() + added) % 60);
  });

  it('addSeconds', () => {
    const date = new Date();
    const added = 3;
    const addedDate = addSeconds(date, added);
    assert.strictEqual(addedDate.getSeconds() % 60, (date.getSeconds() + added) % 60);
  });

  it('cloneDate', () => {
    const date = cloneDate();
    assert.strictEqual(date, undefined);
  });

  it('isEqualDateTime', () => {
    const date = new Date();
    const isEqual = isEqualDateTime(date, date);
    assert.strictEqual(isEqual, true);
  });

  it('isEqualDateTime undefined', () => {
    const isEqual = isEqualDateTime(undefined, undefined);
    assert.strictEqual(isEqual, true);
  });

  it('isEqualDateTime string', () => {
    const date = '1989-05-14';
    const isEqual = isEqualDateTime(date, date);
    assert.strictEqual(isEqual, true);
  });

  it('isEqualDate', () => {
    const date = new Date();
    const isEqual = isEqualDate(date, date);
    assert.strictEqual(isEqual, true);
  });

  it('isEqualDate undefined', () => {
    const isEqual = isEqualDate(undefined, undefined);
    assert.strictEqual(isEqual, true);
  });

  it('isEqualDate string', () => {
    const date = '1989-05-14';
    const isEqual = isEqualDate(date, date);
    assert.strictEqual(isEqual, true);
  });
});
