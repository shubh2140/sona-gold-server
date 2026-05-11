import { getCurrentMonth } from '../../../../../src/core/utils/helpers/date.helpers';

describe('Date helper test', () => {
  it('Should return current start and end month', () => {
    const startAndEndMonth = getCurrentMonth(
      new Date('2025-02-03T18:30:00.000Z'),
    );

    console.log(startAndEndMonth.startDate);

    expect(startAndEndMonth).toEqual({
      start: new Date('2025-02-01T00:00:00.000Z'),
      end: new Date('2025-02-28T00:00:00.000Z'),
    });
  });
});
