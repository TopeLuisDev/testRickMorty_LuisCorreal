import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-2' }));

export const handler = async (event) => {
	try{

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
		const { id } = JSON.parse(event.body);
		console.log("id: ",id)

    	let now = new Date().toISOString();
	
		const paramsDeleteCharacter = {
			TableName: 'characters',
			Key: { id }, 
			UpdateExpression: 'set #attr = :value',
			ExpressionAttributeNames: {
				'#attr': 'deleted', 
			},
			ExpressionAttributeValues: {
				':value': now, 
			},
			ReturnValues: 'UPDATED_NEW',
		};
	
		const result = await ddbDocClient.send(new UpdateCommand(paramsDeleteCharacter));
	
	
		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*", 
				"Access-Control-Allow-Methods": "OPTIONS, PUT, GET, POST"
			},
			body: JSON.stringify(result),
		};

	}catch(error){
		console.log('error:', error)
		return {
			statusCode: 400,
			headers: {
				"Access-Control-Allow-Origin": "*", 
				"Access-Control-Allow-Methods": "OPTIONS, PUT, GET, POST"
			},
			body: JSON.stringify(error),
		};
	}
};