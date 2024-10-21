export interface ICharacter {
	id: string,
	name: string,
	species: string,
	gender: string,
	origin: string,
	location: string,
	image: string,
	episode: string[],
	created: string,
	type: string,
	status: string,
	idOficial: number
}

export interface ICharacterResponse {
  count: number;
  characters: ICharacter[]; // Aquí `ICharacter` es la interfaz para cada personaje individual
}

export interface ICharacterUpdate {
  idCharacter: string,
	idLocation: string
}

export type NewCharacter = Omit<ICharacter, 'cerated' | 'idOficial' | 'id'>;
