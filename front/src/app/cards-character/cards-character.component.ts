import { Component, Inject } from '@angular/core';
import { DataService } from '../services/data.service';
import { ICharacter } from '../models/character/icharacter';
import Swal from 'sweetalert2';
import { ILocation } from '../models/location/ilocation';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cards-character',
  templateUrl: './cards-character.component.html',
  styleUrls: ['./cards-character.component.css', '../app.component.css']
})
export class CardsCharacterComponent {

  characters: ICharacter[] = [];
  locations: ILocation[] = [];

  constructor(private dataService: DataService,
    private dialog: MatDialog
  ) { 
    this.dataService.getCharacters().subscribe(
      (characters) => {
        this.characters = characters;
        let idsCreated = this.characters.map(character => character.idOficial);
        this.dataService.setIdCreated(idsCreated);
      },
      (err) => {
      }
    );
    
    this.dataService.getLocations().subscribe(locations => this.locations = locations, error => console.log(error));
  }

  ngOnInit(): void {
    
  }

  createNewCharacter(){
    const dialog = this.dialog.open(NewCharacterDialogService, 
      {
        data: {
          locations: this.locations
        }
      }
    );
    dialog.afterClosed().subscribe(result => {
      this.dataService.getCharacters().subscribe(
        (characters) => {
          this.characters = characters;
          let idsCreated = this.characters.map(character => character.idOficial);
          this.dataService.setIdCreated(idsCreated);
        },
        (err) => {
          console.log('error:'  + err);
        }
      );
    });
  }

  async editCharacter(idCharacter: string, name: string) {
    let locations = this.locations.reduce((acc: { [key: string]: string }, obj) => {
      acc[obj.id] = obj.name;
      return acc;
    }, {});

    const { value: location } = await Swal.fire({
      title: `Character location update: ${name}`,
      input: "select",
      inputOptions: {
        locations
      },
      inputPlaceholder: "Select a location",
      showCancelButton: true,
      confirmButtonColor: '#02294d',
      cancelButtonColor: 'red'
    });

    if (location) {
      this.dataService.updateCharacter({idCharacter:idCharacter, idLocation: location}).subscribe(
        (response) =>{
          Swal.fire({
            title: 'Character location updated',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
            confirmButtonColor: '#02294d'
          });
          this.dataService.getCharacters().subscribe(characters => this.characters = characters, error => console.log(error));
        },
        (error) => {
          Swal.fire({
            title: 'Error updating character location',
            text: error.error,
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
            confirmButtonColor: '#02294d'
          });
        }
      );
    }

  }

  async deleteCharacter(idCharacter: string, name: string) {
    const { value: isConfirmed } = await Swal.fire({
      title: `You're about to delete the character: ${name}, are you sure?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#02294d',
      cancelButtonColor: 'red',
      confirmButtonText: 'Yes, delete it!'
    });

    if (isConfirmed) {
      this.dataService.deleteCharacter(idCharacter).subscribe(
        (response) => {
          Swal.fire({
            title: 'Character deleted',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
            confirmButtonColor: '#02294d',
          });
          this.dataService.getCharacters().subscribe(characters => this.characters = characters, error => console.log(error));
        },
        (error) => {
          Swal.fire({
            title: 'Error deleting character, try again',
            text: error.error,
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
            confirmButtonColor: '#02294d',
          });
        }
      );
    }
  }

}


@Component({
  selector: 'app-new-character-modal',
  templateUrl: './new-character-dialog.html',
  styleUrl: './new-caracter-dialog.css'
})
export class NewCharacterDialogService {

  formNewCharacter: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    species: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    origin: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    episode: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required])
  });

  statusCharacters = [
    {value: 'alive', viewValue: 'Alive'},
    {value: 'dead', viewValue: 'Dead'},
    {value: 'unknown', viewValue: 'Unknown'}
  ]

  locations: any[] = [];
  


  constructor(public dialogRef: MatDialogRef<NewCharacterDialogService>,
              @Inject(MAT_DIALOG_DATA) public data: { locations: ILocation[]},
              private dataService: DataService
  ) {

    this.locations = this.data.locations.map(location => {
      return {
        value: location.id,
        viewValue: location.name
      };
    });
   }

  openDialog(): void {
    // this.dialogRef.open(NewCharacterDialogService);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitCharacter(){
    this.dataService.createCharacter(this.formNewCharacter.value).subscribe(
      (response) => {
        Swal.fire({
          title: 'Character created',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          confirmButtonColor: '#02294d',
        });
        this.closeDialog();
      },
      (error) => {
        Swal.fire({
          title: 'Error creating character',
          text: error.error,
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
          confirmButtonColor: '#02294d',
        });
      }
    );
  }

}