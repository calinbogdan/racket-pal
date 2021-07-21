const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const getDynamoDBClient = () => new DynamoDBClient({});

module.exports = {
  getDynamoDBClient,
};
