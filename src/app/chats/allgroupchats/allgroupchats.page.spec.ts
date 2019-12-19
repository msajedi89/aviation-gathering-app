import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllgroupchatsPage } from './allgroupchats.page';

describe('AllgroupchatsPage', () => {
  let component: AllgroupchatsPage;
  let fixture: ComponentFixture<AllgroupchatsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllgroupchatsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllgroupchatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
