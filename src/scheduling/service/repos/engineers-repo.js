const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

async function getEngineers() {
  const client = new DynamoDBClient({});

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
