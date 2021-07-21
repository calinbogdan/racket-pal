const [SaturdayIndex, SundayIndex, MondayIndex] = [6, 7, 1];

const dateIsInWeekend = (date) =>
  [SaturdayIndex, SundayIndex].includes(date.weekday);

const getWorkingDayDateBeforeDay = (date) => {
  if ([SaturdayIndex, SundayIndex].includes(date.weekday)) {
    return date.minus({ days: date.weekday - 5 });
  }
  if (MondayIndex === date.weekday) {
    return date.minus({ days: 3 });
  }
  return date.minus({ days: 1 });
};

module.exports = {
  dateIsInWeekend,
  getWorkingDayDateBeforeDay,
};
