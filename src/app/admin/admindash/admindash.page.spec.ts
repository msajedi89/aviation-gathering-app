import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmindashPage } from './admindash.page';

describe('AdmindashPage', () => {
  let component: AdmindashPage;
  let fixture: ComponentFixture<AdmindashPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmindashPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmindashPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
