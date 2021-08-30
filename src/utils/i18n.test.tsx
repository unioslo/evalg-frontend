import { fireEvent, render } from 'test-utils';
import { getInstNameWithCase } from './i18n';

describe('getInstNameWithCase', () => {
  test.each([
    ['uio', 'UiO'],
    ['uiO', 'UiO'],
    ['UIo', 'UiO'],
    ['UiO', 'UiO'],
    ['khio', 'KHiO'],
    ['KHiO', 'KHiO'],
    ['Khio', 'KHiO'],
    ['hiof', 'HiOF'],
    ['HiOF', 'HiOF'],
    ['Hiof', 'HiOF'],
    ['oslomet', 'OsloMet'],
    ['OSLOMET', 'OsloMet'],
    ['OsloMet', 'OsloMet'],
  ])('given %p as input, expect %p', (a, expected) => {
    expect(getInstNameWithCase(a)).toBe(expected);
  });

  it('should throw a valueError for unknown institutions', () => {
    expect(() => {
      getInstNameWithCase('');
    }).toThrow(TypeError);
    expect(() => {
      getInstNameWithCase('uikkkf');
    }).toThrow(TypeError);
  });
});
