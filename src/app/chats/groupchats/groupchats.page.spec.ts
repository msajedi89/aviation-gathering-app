import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupchatsPage } from './groupchats.page';

describe('GroupchatsPage', () => {
  let component: GroupchatsPage;
  let fixture: ComponentFixture<GroupchatsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupchatsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupchatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
