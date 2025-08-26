import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalClose } from 'src/app/entities/enum/modal-close.enum';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponent implements OnInit {

  @Input() texto : string;
  @Input() titulo : string;
  @Input() textoBotao : string;

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    if (!this.textoBotao)
      this.textoBotao = "Entendi";
  }

  onFechar(motivo : string){
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

    this.activeModal.dismiss()
  }

  onKeyDown(event: { keyCode: any; which: any; preventDefault: () => void; }){
    const codigoTecla = Number(event.keyCode) || Number(event.which);

    switch (codigoTecla) {
      case 13:
        event.preventDefault();
        this.onFechar('sim');
        break;

      default:
        break;
    }
  }

}

