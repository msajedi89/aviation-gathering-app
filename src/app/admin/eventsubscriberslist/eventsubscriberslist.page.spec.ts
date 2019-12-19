import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsubscriberslistPage } from './eventsubscriberslist.page';

describe('EventsubscriberslistPage', () => {
  let component: EventsubscriberslistPage;
  let fixture: ComponentFixture<EventsubscriberslistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsubscriberslistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsubscriberslistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
