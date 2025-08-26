import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensagemModalComponent } from './mensagem-modal.component';

describe('MensagemModalComponent', () => {
  let component: MensagemModalComponent;
  let fixture: ComponentFixture<MensagemModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensagemModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensagemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
