import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import axios from 'axios';
import { randomUUID } from "crypto";


const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-2' }));

class CreateCharacters {
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
				status: item.status,
				species: item.species,
				type: item.type,
				gender: item.gender,
				origin: item.origin.name,
				location: item.location.name,
				image: item.image,
				episode: item.episode,
				created: item.created,
				deleted: null,
				idOficial: item.id
			};
		});
	}

	async putCharacters(characters){
		for (const character of characters) {
			try{
				await ddbDocClient.send(new PutCommand({
					TableName: "characters",
					Item: character,
				}));
				this.namesCreated.push(character.name);
				this.countSuccessful += 1;
			}catch(error){
				this.errors.push(error);
			}
		}
	}
	
}


export const handler = async(event) => {

	const req = JSON.parse(event.body)
	const charactersPages = parseInt(req.charactersPages);
	
	let responseRM = await axios.get('https://rickandmortyapi.com/api/character');
	let pages = responseRM.data.info.pages;
	let characters = responseRM.data.results;
	let next = responseRM.data.info.next;
	
	if (charactersPages > pages){
		return {
			statusCode: 400,
			body: JSON.stringify({
				"error": "Number of requested pages exceeds the available ones.",
				"maxPage": pages
			}),
		};
	}
	if (charactersPages <= 0){
		return {
			statusCode: 400,
			body: JSON.stringify({
				"error": "Number of requested pages no valid.",
				"maxPage": pages
			}),
		};
	}

	const createCharacters = new CreateCharacters();

	characters = createCharacters.preProcess(characters);
	console.log(characters)
	characters.sort((a, b) => a.id - b.id);
	await createCharacters.putCharacters(characters);

	if (pages > 1 && charactersPages > 1) {
		for (let i = 2; i <= charactersPages; i++) {
			responseRM = await axios.get(next);
			next = responseRM.data.info.next;
			characters = characters.concat(responseRM.data.results);
			characters = createCharacters.preProcess(characters);
			await createCharacters.putCharacters(characters);
		}
	}

	
	
	let body = {
		"countSuccessful": createCharacters.countSuccessful,
		"errors":createCharacters.errors,
		"namesCreated": createCharacters.namesCreated
	};

	if (createCharacters.countSuccessful > 0){
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
