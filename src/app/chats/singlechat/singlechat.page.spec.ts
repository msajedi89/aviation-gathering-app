import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglechatPage } from './singlechat.page';

describe('SinglechatPage', () => {
  let component: SinglechatPage;
  let fixture: ComponentFixture<SinglechatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglechatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglechatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
