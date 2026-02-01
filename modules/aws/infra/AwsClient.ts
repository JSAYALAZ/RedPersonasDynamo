import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

// DocumentClient te deja usar JSON normal (sin {S:..., N:...})
export const dynamo_client = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});
