import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensagemDetailComponent } from './mensagem-detail.component';

describe('MensagemDetailComponent', () => {
  let component: MensagemDetailComponent;
  let fixture: ComponentFixture<MensagemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensagemDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensagemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
