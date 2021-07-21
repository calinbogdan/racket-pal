const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { getDynamoDBClient } = require("../../../utils/dynamodb");

async function getEngineers() {
  const client = getDynamoDBClient();

  const engineers = await client.send(
    new ScanCommand({
      TableName: "engineers",
    })
  );

  if (engineers.Items) {
    return engineers.Items.map((engineerItem) => unmarshall(engineerItem));
  }

  return [];
}

const EngineersRepo = {
  getEngineers,
};

module.exports = EngineersRepo;
