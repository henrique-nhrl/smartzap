import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthHttpService } from 'src/app/services/auth-http.service';

@Component({
  selector: 'app-modal-reset-password',
  templateUrl: './modal-reset-password.component.html',
  styleUrls: ['./modal-reset-password.component.scss']
})
export class ModalResetPasswordComponent implements OnInit {

    public newPassword: string;
    public confirmPassword: string;

    @Output() valueUpdated = new EventEmitter<string>();

    constructor(public activeModal: NgbActiveModal,
      private notification: NzNotificationService,
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
          newPassword: this.newPassword
        }
        this.activeModal.close(response);
      }
    }

    async validar() {
      try {
      if(!this.newPassword || this.newPassword.length > 6) {
        this.notification.info('Informação','A senha deve conter pelo menos 6 caracteres');
        const el = document.getElementById('senha');
        el?.focus();
        return false;
      }
      if(this.confirmPassword !== this.confirmPassword) {
        this.notification.info('Informação','Senha e confirmação não correspondem');
        const el = document.getElementById('confirmarSenha');
        el?.focus();
        return false;
      }

      return true;
      }
      catch(error)
      {
        return false;
      }
    }
}
