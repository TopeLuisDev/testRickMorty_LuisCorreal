import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsCharacterComponent } from './cards-character.component';

describe('CardCharacterComponent', () => {
  let component: CardsCharacterComponent;
  let fixture: ComponentFixture<CardsCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardsCharacterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardsCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
