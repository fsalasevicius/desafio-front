import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTournamentFormComponent } from './user-tournament-form.component';

describe('UserTournamentFormComponent', () => {
  let component: UserTournamentFormComponent;
  let fixture: ComponentFixture<UserTournamentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTournamentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTournamentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
