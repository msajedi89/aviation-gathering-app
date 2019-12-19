import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminnewsinglechatsPage } from './adminnewsinglechats.page';

describe('AdminnewsinglechatsPage', () => {
  let component: AdminnewsinglechatsPage;
  let fixture: ComponentFixture<AdminnewsinglechatsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminnewsinglechatsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminnewsinglechatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
