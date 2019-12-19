import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventslistPage } from './eventslist.page';

describe('EventslistPage', () => {
  let component: EventslistPage;
  let fixture: ComponentFixture<EventslistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventslistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventslistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
