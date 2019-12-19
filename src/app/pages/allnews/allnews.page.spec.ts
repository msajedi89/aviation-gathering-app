import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllnewsPage } from './allnews.page';

describe('AllnewsPage', () => {
  let component: AllnewsPage;
  let fixture: ComponentFixture<AllnewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllnewsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllnewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
