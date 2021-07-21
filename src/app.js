const express = require("express");
const Joi = require("joi");
const { DateTime } = require("luxon");
const EngineersRepo = require("./scheduling/service/repos/engineers-repo");
const ScheduleRepo = require("./scheduling/service/repos/schedule-repo");
const SchedulingService = require("./scheduling/service/service");

const app = express();

app.use(express.json());

const schedulePayloadSchema = Joi.object({
  date: Joi.string().isoDate().required(),
});

app.get("/", async (req, res) => {
  const engineers = await ScheduleRepo.getScheduleFor14DaysFrom(DateTime.now());

  res.send(engineers);
});

app.post("/schedule", async (req, res) => {
  const validationResult = schedulePayloadSchema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  const date = validationResult.value.date;

  const dateToSchedule = DateTime.fromISO(date);

  try {
    const scheduledEngineers = await SchedulingService.scheduleFor(
      dateToSchedule
    );
    return res.status(200).json({ scheduledEngineers });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

module.exports = app;
