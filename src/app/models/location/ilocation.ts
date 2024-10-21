export interface ILocation {
	id: string,
	name: string
}

export interface ILocationResponse {
  count: number;
  locations: ILocation[]; // Aquí `ILocation` es la interfaz para cada personaje individual
}
