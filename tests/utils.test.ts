import { validateProjectName } from '../src/utils';

describe('Utils', () => {
  test('validateProjectName should work correctly', () => {
    expect(validateProjectName('my-project')).toBe(true);
    expect(validateProjectName('My Project')).toBe(false);
  });
});