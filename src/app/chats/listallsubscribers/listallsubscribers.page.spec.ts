import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListallsubscribersPage } from './listallsubscribers.page';

describe('ListallsubscribersPage', () => {
  let component: ListallsubscribersPage;
  let fixture: ComponentFixture<ListallsubscribersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListallsubscribersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListallsubscribersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
