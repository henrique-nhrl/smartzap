import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalClose } from 'src/app/entities/enum/modal-close.enum';

@Component({
  selector: 'app-modal-question',
  templateUrl: './modal-question.component.html',
  styleUrls: ['./modal-question.component.scss']
})
export class ModalQuestionComponent implements OnInit  {

  @Input() texto: string;
  @Input() titulo: string;
  @Input() textoCheckbox: string;

  naoSelecionado = false;
  simSelecionado = true;
  hideClose = false;
  showCheckbox = false;
  valorCheckbox = false;

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {

  }

  onFechar(motivo: string) {
    switch (motivo) {
      case ('fechar') :
        this.activeModal.dismiss(ModalClose.FECHOU);
        break;
      case ('nao') :
        this.activeModal.dismiss(ModalClose.NAO);
        break;
      case ('sim') :
        this.activeModal.dismiss(ModalClose.SIM);
        break;
    }


    this.activeModal.dismiss();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.naoSelecionado = true;
      this.simSelecionado = false;
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      this.naoSelecionado = false;
      this.simSelecionado = true;
      event.preventDefault();
    } else if (event.key === 'Enter') {
      const botao = this.simSelecionado ? document.getElementById('btn-sim') : document.getElementById('btn-nao');
      if (botao) {
        botao.click();
        event.preventDefault();
      }
    } else if (event.key === ' '){
      event.preventDefault();
      this.valorCheckbox = !this.valorCheckbox;
    }
  }

}
