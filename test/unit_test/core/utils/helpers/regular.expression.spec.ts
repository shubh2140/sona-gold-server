import { isDigitsOnly } from '../../../../../src/core/utils/helpers/regular.expressions';

describe('Regular expression test', () => {
  it('Should check that string contains only numbers', () => {
    const invalidInput = '74102596g';
    const invalidInputResult = isDigitsOnly(invalidInput);
    expect(invalidInputResult).toEqual(false);

    const validInput = '741025963';
    const validInputResult = isDigitsOnly(validInput);
    expect(validInputResult).toEqual(true);
  });
});
