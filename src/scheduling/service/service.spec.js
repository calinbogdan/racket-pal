const { DateTime } = require("luxon");
const SchedulingService = require("./service");
const ScheduleRepo = require("./repos/schedule-repo");
const _ = require("lodash");

describe("Scheduling Service", () => {
  it("should select two different engineers in a given day", async () => {
    const lodashSampleSizeSpy = jest.spyOn(_, "sampleSize");
    const getScheduleForDateSpy = jest
      .spyOn(ScheduleRepo, "getScheduleForDate")
      .mockResolvedValue({
        firstEngineerId: 1,
        secondEngineerId: 2,
      });

    const schedule = await SchedulingService.scheduleFor(DateTime.now());

    expect(lodashSampleSizeSpy).toHaveBeenCalled();
    lodashSampleSizeSpy.mockRestore();
    getScheduleForDateSpy.mockRestore();
  });

});
