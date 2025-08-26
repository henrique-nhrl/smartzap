import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthHttpService } from 'src/app/services/auth-http.service';
import { firstValueFrom } from 'rxjs';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-modal-recuperar-senha',
  templateUrl: './modal-recuperar-senha.component.html',
  styleUrls: ['./modal-recuperar-senha.component.scss']
})
export class ModalRecuperarSenhaComponent implements OnInit {

  public email: string;

  @Output() valueUpdated = new EventEmitter<string>();

  constructor(public activeModal: NgbActiveModal,
    private notification: NzNotificationService,
    private usuarioHttpService: AuthHttpService,
  ) {
   }

  ngOnInit(): void {

  }


  handleCancel(): void {
    this.activeModal.dismiss('cancel');
  }

  async handleUpdate() {
    if (await this.validar()) {
      const response = {
         email: this.email
      }
      this.activeModal.close(response);
    }
  }

  async validar() {
    try {
    if(!this.email) {
      this.notification.info('Informação','Informe o email');
      const el = document.getElementById('email');
      el?.focus();
      return false;
    }
    const emailValido = await Utils.validateEmail(this.email);
    if(!emailValido) {
      this.notification.info('Informação','Informe o email');
      const el = document.getElementById('email');
      el?.focus();
      return false;
    }
    const existsEmail: boolean = (await this.emailExiste(this.email)) as boolean;
    if(!existsEmail){
      this.notification.info('Informação','E-mail informado não existe');
      const el = document.getElementById('email');
      el?.focus();
      return false;
    }

    // if(!this.cliente.senha || this.cliente.senha.length > 6) {
    //   this.notification.info('Informação','A senha deve conter pelo menos 6 caracteres');
    //   const el = document.getElementById('senha');
    //   el?.focus();
    //   return false;
    // }
    // if(this.cliente.senha !== this.confirmarSenha) {
    //   this.notification.info('Informação','Senha e confirmação não correspondem');
    //   const el = document.getElementById('confirmarSenha');
    //   el?.focus();
    //   return false;
    // }

    return true;
    }
    catch(error)
    {
      return false;
    }
  }


  async emailExiste(email: string): Promise<boolean> {
    try {
      const usuario = await firstValueFrom(this.usuarioHttpService.getByEmail(email));
      return !! usuario;
    } catch(error) {
      return false;
    }
  }


}
