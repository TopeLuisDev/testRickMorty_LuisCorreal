import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { ICharacter, ICharacterResponse, ICharacterUpdate, NewCharacter } from '../models/character/icharacter';
import { ILocation, ILocationResponse } from '../models/location/ilocation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  uri = environment.apiUrl;
  idsCreated: Number[]= [];

  constructor(private http: HttpClient) { 
    
  }

  setIdCreated(idsCreated: Number[]){ 
    this.idsCreated = idsCreated;
  }

  getCharacters(){
    return this.http.get<ICharacterResponse>(this.uri + '/getCharacters').pipe(
      map((response: ICharacterResponse) => response.characters)
    );
  }

  getLocations(){
    return this.http.get<ILocationResponse>(this.uri + '/getLocations').pipe(
      map((response: ILocationResponse) => response.locations)
    );
  }

  updateCharacter(info: ICharacterUpdate): Observable<any>{
    let url = this.uri + '/updatedCharacter';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<any>(url, info, { headers });

  }

  createCharacter(info: NewCharacter): Observable<any>{
    let url = this.uri + '/createCharacter';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(url, info, { headers });
  }

  deleteCharacter(id: string): Observable<any>{
    let url = this.uri + '/deletedCharacter';
    return this.http.put<any>(url, {id});
  }

}
