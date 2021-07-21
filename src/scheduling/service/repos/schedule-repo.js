const {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  BatchGetItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const _ = require("lodash");
const { getDynamoDBClient } = require("../../../utils/dynamodb");
const { dateIsInWeekend } = require("../utils/date");

const dateTimeToIndex = (date) => date.toISODate();

const ENGINEER_SCHEDULE_TABLE = "engineer-schedule";

async function getScheduleForDate(date) {
  const client = getDynamoDBClient();
  const dateIndex = dateTimeToIndex(date);

  const schedule = await client.send(
    new GetItemCommand({
      TableName: ENGINEER_SCHEDULE_TABLE,
      Key: marshall({
        date: dateIndex,
      }),
    })
  );

  if (schedule.Item) {
    return unmarshall(schedule.Item);
  }
}

async function saveSchedule(schedule, date) {
  const dateIndex = dateTimeToIndex(date);
  const client = getDynamoDBClient();

  await client.send(
    new PutItemCommand({
      TableName: ENGINEER_SCHEDULE_TABLE,
      Item: marshall({
        ...schedule,
        date: dateIndex,
      }),
    })
  );
}

async function getScheduleFor13DaysFrom(date) {
  const workingDaysInTheLast13Days = _.range(13, 0, -1)
    .map((number) => date.minus({ days: number }))
    .filter((date) => !dateIsInWeekend(date));

  const workingDaysInTheLast13DaysToIndexes = workingDaysInTheLast13Days.map(
    (date) => dateTimeToIndex(date)
  );

  const client = getDynamoDBClient();
  const schedule = await client.send(
    new BatchGetItemCommand({
      RequestItems: {
        [ENGINEER_SCHEDULE_TABLE]: {
          Keys: workingDaysInTheLast13DaysToIndexes.map((index) =>
            marshall({
              date: index,
            })
          ),
        },
      },
    })
  );

  return schedule.Responses[ENGINEER_SCHEDULE_TABLE].map((item) =>
    unmarshall(item)
  );
}

const ScheduleRepo = {
  getScheduleForDate,
  saveSchedule,
  getScheduleFor14DaysFrom: getScheduleFor13DaysFrom,
};

module.exports = ScheduleRepo;
