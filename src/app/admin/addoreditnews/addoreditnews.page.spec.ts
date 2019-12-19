import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddoreditnewsPage } from './addoreditnews.page';

describe('AddoreditnewsPage', () => {
  let component: AddoreditnewsPage;
  let fixture: ComponentFixture<AddoreditnewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddoreditnewsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddoreditnewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
