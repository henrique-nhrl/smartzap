import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-currency-modal',
  templateUrl: './currency-modal.component.html',
  styleUrls: ['./currency-modal.component.scss']
})
export class CurrencyModalComponent {
  @Input() currencyValue: string;
  @Output() valueUpdated = new EventEmitter<string>();

  constructor(public activeModal: NgbActiveModal){}

  handleCancel(): void {
    this.activeModal.dismiss('cancel');
  }

  handleUpdate() {
    this.valueUpdated.emit(this.currencyValue);
    this.activeModal.close(this.currencyValue);
  }
}
