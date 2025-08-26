import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateTime } from '@eonasdan/tempus-dominus';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-mensagem-modal',
  templateUrl: './mensagem-modal.component.html',
  styleUrls: ['./mensagem-modal.component.scss']
})
export class MensagemModalComponent {
  @Input() title: string;
  @Input() currencyValue: string;
  @Input() textValue: string;
  @Input() dtAgendValue: DateTime = new DateTime();
  @Input() hrAgendValue: DateTime = new DateTime();
  @Input() disabledCurrencyValue: boolean = false;
  @Input() disabledtextValue: boolean = false;
  @Input() disableddtAgendValue: boolean = false;
  @Input() disabledhrAgendValue: boolean = false;

  @Output() valueUpdated = new EventEmitter<string>();

  constructor(public activeModal: NgbActiveModal,
    private notification: NzNotificationService,
  ) { }

  handleCancel(): void {
    this.activeModal.dismiss('cancel');
  }

  async handleUpdate() {
    if (await this.validar()) {
      this.valueUpdated.emit(this.currencyValue);
      this.valueUpdated.emit(this.textValue);
      // this.valueUpdated.emit(this.dtAgendValue);
      const response = {
        currencyValue: this.currencyValue,
        textValue: this.textValue,
        dtAgendValue: this.dtAgendValue,
        hrAgendValue: this.hrAgendValue
      }
      this.activeModal.close(response);
    }
  }

  async validar() {
    if(!this.disableddtAgendValue && !this.verificarDataHoraAgendamento()) {
      this.notification.info('Informação','Data/Hora informada é inferior a atual');
      const el = document.getElementById('dataAgendamento');
      el?.focus();
      return false;
    }
    return true;
  }

  verificarDataHoraAgendamento() {
    const dataHoraAtual = moment();
  const dataAgendada = moment(this.dtAgendValue).format('YYYY-MM-DD'); // Extrair a data de dtAgend
  const horaAgendada = moment(this.hrAgendValue).format('HH:mm'); // Extrair a hora de hrAgend

  // Combinar data e hora em um único objeto moment
  const dataHoraAgendada = moment(`${dataAgendada} ${horaAgendada}`, 'YYYY-MM-DD HH:mm');

  return dataHoraAgendada.isSameOrAfter(dataHoraAtual);
  }

}
