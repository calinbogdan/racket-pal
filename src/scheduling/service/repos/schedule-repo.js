const _ = require("lodash");
const { dateIsInWeekend } = require("../utils/date");

const dateTimeToIndex = (date) => date.toISODate();

const SchedulePseudoMongoTable = {};

async function getScheduleForDate(date) {
  const dateIndex = dateTimeToIndex(date);
  return Promise.resolve(SchedulePseudoMongoTable[dateIndex]);
}

async function saveSchedule(schedule, date) {
  const dateIndex = dateTimeToIndex(date);
  SchedulePseudoMongoTable[dateIndex] = { ...schedule };
  return Promise.resolve();
}

async function getScheduleFor14DaysFrom(date) {
  const workingDaysInTheLast14Days = _.range(13, -1, -1)
    .map((number) => date.minus({ days: number }))
    .filter((date) => !dateIsInWeekend(date));

  return Promise.resolve(
    workingDaysInTheLast14Days
      .map((workingDay) => {
        const dateIndex = dateTimeToIndex(workingDay);
        return SchedulePseudoMongoTable[dateIndex];
      })
      .filter((schedule) => !!schedule) // filter out undefined entries
  );
}

const ScheduleRepo = {
  getScheduleForDate,
  saveSchedule,
  getScheduleFor14DaysFrom,
};

module.exports = ScheduleRepo;
