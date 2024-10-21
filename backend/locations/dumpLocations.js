import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import axios from 'axios';
import { randomUUID } from "crypto";


const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-2' }));

class CreateLocations {
	constructor(){
		this.countSuccessful = 0;
		this.errors = [];
		this.namesCreated = [];
	}
	
	preProcess(data) {
		return data.map(item => {
			return {
				id: randomUUID(),
				name: item.name,
				type: item.type,
				dimension: item.dimension,
				created: item.created,
				deleted: null
			};
		});
	}

	async putLocations(locations){
		for (const location of locations) {
			try{
				await ddbDocClient.send(new PutCommand({
					TableName: "locations",
					Item: location,
				}));
				this.namesCreated.push(location.name);
				this.countSuccessful += 1;
			}catch(error){
				console.error('error: ', error.message)
				this.errors.push(error.message);
			}
		}
	}
	
}


export const handler = async(event) => {

	const req = JSON.parse(event.body)
	const pageNumber = parseInt(req.pageNumber);
	
	let url = "https://rickandmortyapi.com/api/location";
	if (pageNumber <= 0){
		return {
			statusCode: 400,
			body: JSON.stringify({
				"error": "Number of requested pages no valid.",
				"maxPage": pages
			}),
		};
	}
	
	if (pageNumber > 1){
		url = `https://rickandmortyapi.com/api/location?page=${pageNumber}`
	}

	let responseRM = await axios.get(url);
	let pages = responseRM.data.info.pages;
	let locations = responseRM.data.results;
	let next = responseRM.data.info.next;

	const createlocations = new CreateLocations();

	locations = createlocations.preProcess(locations);
	console.log(locations)
	locations.sort((a, b) => a.id - b.id);
	await createlocations.putLocations(locations);	
	
	let body = {
		"countSuccessful": createlocations.countSuccessful,
		"errors":createlocations.errors,
		"namesCreated": createlocations.namesCreated
	};

	if (createlocations.countSuccessful > 0){
		return {
			statusCode: 201,
			body: JSON.stringify(body),
		};
	}else{
		return {
			statusCode: 500,
			body: JSON.stringify(body),
		};
	}
}