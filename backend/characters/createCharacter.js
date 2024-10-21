import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from "crypto";


const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-2' }));

export const handler = async(event) => {

	let body;
	try {
		body = JSON.parse(event.body);
	} catch (err) {
		return {
				statusCode: 400,
				body: JSON.stringify({ message: "Invalid JSON in request body" }),
		};
	}

	const requiredFields = ['name', 'status', 'species', 'type', 'gender', 'origin', 'location', 'image', 'episode'];

	const missingFields = requiredFields.filter(field => !body.hasOwnProperty(field));

	if (missingFields.length > 0) {
			return {
					statusCode: 400,
					body: JSON.stringify({ message: `Missing required fields: ${missingFields.join(', ')}` }),
			};
	}

	try{

		const resultLocation = await ddbDocClient.send(new GetCommand({
			TableName: 'locations',
			Key: { id: body.location }
		}));
		
		if (!resultLocation?.Item){
			return {
				StatusCode: 400,
				body: JSON.stringify({
					"message": "Location not found."
				})
			}
		}


		const newCharacter = {
			...body,
			id: randomUUID(),
			created: new Date().toISOString(),
			deleted: null,
			location: resultLocation?.Item.name
		}
		await ddbDocClient.send(new PutCommand({
			TableName: "characters",
			Item: newCharacter,
		}));
		return {
			statusCode: 201,
			body: JSON.stringify({
				'message': 'create successful',
				'newCharacter': newCharacter
			})
		}

	}catch(error){
		return {
			statusCode: 400,
			body: JSON.stringify({
				'message': error.message
			})
		}
	}

};