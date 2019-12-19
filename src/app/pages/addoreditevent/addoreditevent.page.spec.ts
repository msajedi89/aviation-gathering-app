import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddorediteventPage } from './addoreditevent.page';

describe('AddorediteventPage', () => {
  let component: AddorediteventPage;
  let fixture: ComponentFixture<AddorediteventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddorediteventPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddorediteventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
