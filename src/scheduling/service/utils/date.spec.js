const _ = require("lodash");
const { DateTime } = require("luxon");
const { dateIsInWeekend, getWorkingDayDateBeforeDay } = require("./date");

describe("dateIsInWeekend", () => {
  test.each([1, 2, 3, 4, 5])(
    "should return false if weekday index is %d",
    (weekdayIndex) => {
      const date = DateTime.fromObject({ weekday: weekdayIndex });
      expect(dateIsInWeekend(date)).toBeFalsy();
    }
  );

  test.each([6, 7])(
    "should return true if weekday index is %d",
    (weekdayIndex) => {
      const date = DateTime.fromObject({ weekday: weekdayIndex });
      expect(dateIsInWeekend(date)).toBeTruthy();
    }
  );
});

const getWorkingDayDateBeforeDayCases = [
  [5, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [5, 7],
];

describe("getWorkingDayDateBeforeDay", () => {
  it("should return a DateTime object", () => {
    const date = getWorkingDayDateBeforeDay(DateTime.now());
    expect(date).toBeInstanceOf(DateTime);
  });

  test.each(getWorkingDayDateBeforeDayCases)(
    "should return a date with weekday %d given a date with weekday %d",
    (weekdayResult, weekdayInput) => {
      const inputDate = DateTime.fromObject({ weekday: weekdayInput });
      const workingDateDayBefore = getWorkingDayDateBeforeDay(inputDate);
      expect(workingDateDayBefore.weekday).toBe(weekdayResult);
    }
  );
});
