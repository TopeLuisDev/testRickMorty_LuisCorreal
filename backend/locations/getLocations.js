import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';


const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-2' }));

export const handler = async (event) => {
  try {
    const result = await ddbDocClient.send(new ScanCommand({
      TableName: 'locations',
      ScanIndexForward: true,
      FilterExpression: "deleted = :deletedValue",
      ExpressionAttributeValues: {
        ":deletedValue": null
      }
    }));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        "count": result.Count,
        "locations": result.Items
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }

};