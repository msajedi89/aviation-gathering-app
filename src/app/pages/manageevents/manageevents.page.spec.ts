import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageeventsPage } from './manageevents.page';

describe('ManageeventsPage', () => {
  let component: ManageeventsPage;
  let fixture: ComponentFixture<ManageeventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageeventsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageeventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
