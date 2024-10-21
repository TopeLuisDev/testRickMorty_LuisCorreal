import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-2' }));

export const handler = async (event) => {
  try{
    const result = await ddbDocClient.send(new ScanCommand({
      TableName: 'characters',
      ScanIndexForward: true,
      FilterExpression: "deleted = :deletedValue",
      ExpressionAttributeValues: {
        ":deletedValue": null
      },
      ProjectionExpression: "id, species, #loc, image, episode, created, #nam, gender, origin, #sta, #typ, idOficial",
      ExpressionAttributeNames: {
        "#loc": "location",
        "#nam": "name",
        "#sta": "status",
        "#typ": "type"
      }
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        "count": result.Count,
        "characters": result.Items
      }),
    };
  }catch(error){
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }

};