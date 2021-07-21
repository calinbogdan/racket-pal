const _ = require("lodash");
const EngineersRepo = require("./repos/engineers-repo");
const ScheduleRepo = require("./repos/schedule-repo");
const { dateIsInWeekend, getWorkingDayDateBeforeDay } = require("./utils/date");

const SchedulingService = {
  async scheduleFor(date) {
    if (dateIsInWeekend(date)) {
      throw Error("Can't schedule in a Saturday or a Sunday");
    }
    // get all engineers
    const engineers = await EngineersRepo.getEngineers();

    const dateForDayBefore = getWorkingDayDateBeforeDay(date);

    // filter out engineers that worked the day before
    const scheduleFromTheDayBefore = await ScheduleRepo.getScheduleForDate(
      dateForDayBefore
    );

    const engineerIdsScheduledTheDayBefore = scheduleFromTheDayBefore
      ? [
          scheduleFromTheDayBefore.firstEngineerId,
          scheduleFromTheDayBefore.secondEngineerId,
        ]
      : [];

    // filter out engineers that worked twice in the last 14 days
    const scheduleForTheLast14Days = await ScheduleRepo.getScheduleFor14DaysFrom(
      date
    );

    const engineerIdsFromPastSchedule = scheduleForTheLast14Days.flatMap(
      ({ firstEngineerId, secondEngineerId }) => [
        firstEngineerId,
        secondEngineerId,
      ]
    );

    const engineersThatWorkedTwoShiftsInTheLastTwoWeeks = _.toPairs(
      _.groupBy(engineerIdsFromPastSchedule)
    )
      .filter(([engineerId, occurencesArray]) => occurencesArray.length === 2)
      .map(([engineerId]) => parseInt(engineerId));

    console.log(
      "Worked two shifts: ",
      engineersThatWorkedTwoShiftsInTheLastTwoWeeks
    );

    const ineligibleEngineerIds = [
      ...engineerIdsScheduledTheDayBefore,
      ...engineersThatWorkedTwoShiftsInTheLastTwoWeeks,
    ]; // a Set would've worked

    console.log("Worked the day before: ", engineerIdsScheduledTheDayBefore);

    const eligibleEngineers = engineers.filter(
      ({ id }) => !ineligibleEngineerIds.includes(id)
    );

    console.log(
      "Eligible: ",
      eligibleEngineers.map((e) => e.id)
    );

    const [firstEligibleEngineerId, secondEligibleEngineerId] = _.sampleSize(
      eligibleEngineers,
      2
    ).map((engineer) => engineer.id);

    const schedule = {
      date: date.toISODate(),
      firstEngineerId: firstEligibleEngineerId,
      secondEngineerId: secondEligibleEngineerId,
    };

    await ScheduleRepo.saveSchedule(schedule, date);

    return schedule;
  },
};

module.exports = SchedulingService;
