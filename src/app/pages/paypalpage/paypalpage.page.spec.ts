import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypalpagePage } from './paypalpage.page';

describe('PaypalpagePage', () => {
  let component: PaypalpagePage;
  let fixture: ComponentFixture<PaypalpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaypalpagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaypalpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
