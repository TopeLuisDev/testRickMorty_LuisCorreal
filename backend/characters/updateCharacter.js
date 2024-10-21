import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-2' }));

export const handler = async (event) => {

	console.log('method: ', event.requestContext.http.method)

	if (event.requestContext.http.method === 'OPTIONS') {
		console.log("entrando a options")
		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*', // Permite cualquier origen, puedes restringirlo a tu dominio
				'Access-Control-Allow-Methods': 'OPTIONS, PUT, GET, POST', // Métodos permitidos
				'Access-Control-Allow-Headers': 'Content-Type', // Encabezados permitidos
			},
			body: '',
		};
	}
	try{
		const { idCharacter , idLocation } = JSON.parse(event.body);

		console.log('location: ', idLocation)
		console.log('idCharacter: ', idCharacter)
		
		const resultLocation = await ddbDocClient.send(new GetCommand({
			TableName: 'locations',
			Key: { id: idLocation }
		}))
	
		console.log('location: ', resultLocation)
		
		if (!resultLocation?.Item){
			return {
				StatusCode: 400,
				body: JSON.stringify({
					"message": "Location not found."
				})
			}
		}

		console.log("resultLocation?.Item.mame: ", resultLocation?.Item.name)

		const paramsUpdateCharacter = {
			TableName: 'characters',
			Key: { id: idCharacter }, 
			UpdateExpression: 'set #attr = :value',
			ExpressionAttributeNames: {
				'#attr': 'location', 
			},
			ExpressionAttributeValues: {
				':value': resultLocation?.Item.name, 
			},
			ReturnValues: 'UPDATED_NEW',
		};
	
		const result = await ddbDocClient.send(new UpdateCommand(paramsUpdateCharacter));
	
	
		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*", 
				"Access-Control-Allow-Methods": "*"
			},
			body: JSON.stringify(result),
		};

	}catch(error){
		return {
			statusCode: 400,
			headers: {
				"Access-Control-Allow-Origin": "*", 
				"Access-Control-Allow-Methods": "*"
			},
			body: JSON.stringify(error.message),
		};
	}
};