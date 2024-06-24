import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopaMenuComponent } from './copa-menu.component';

describe('CopaMenuComponent', () => {
  let component: CopaMenuComponent;
  let fixture: ComponentFixture<CopaMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopaMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
