import { Utils } from 'src/app/utils/utils';
import { TerminalHttpService } from './../../services/terminal-http.service';
import { WhatsappHttpService } from './../../services/whatsapp-http.service';
import { ClienteHttpService } from './../../services/cliente-http.service';
import { Login } from './../../entities/interfaces/login.model';
import { Component, NgZone, OnInit } from '@angular/core';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthHttpService } from 'src/app/services/auth-http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalNovoUsuarioComponent } from 'src/app/components/modal-novo-usuario/modal-novo-usuario.component';
import { Usuario } from 'src/app/entities/usuario';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { ModalRecuperarSenhaComponent } from 'src/app/components/modal-recuperar-senha/modal-recuperar-senha.component';
import { ModalResetPasswordComponent } from 'src/app/components/modal-reset-password/modal-reset-password.component';

declare const gapi: any;

interface GoogleUserProfile {
  getId(): string;
  getName(): string;
  getImageUrl(): string;
  getEmail(): string;
}

interface GoogleUser {
  getBasicProfile(): GoogleUserProfile;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
  credentials = { email: '', password: '' };
  public login: Login;
  isProcessando: boolean = false;
  isProcessandoNewUser: boolean = false;
  private usuario: Usuario;
  tempoRestante = 120; // 2 minutos
  intervalo: any;

  constructor(
    private notification: NzNotificationService,
    private authHttpService: AuthHttpService,
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private clienteHttpService: ClienteHttpService,
    private whatsappHttpService: WhatsappHttpService,
    private terminalHttpService: TerminalHttpService
  ) {
    this.login = {email: '', senha: '', lembrarMe: false};
   }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.openResetPasswordModal(token);
      }
    });

  }

  onSubmit(form: NgForm): void {
    this.isProcessando = true;
    if (!form.valid) {
      if ((!this.login.email) || (this.login.email === '')) {
        this.notification.warning('Atenção', 'Email não informado');
      }

      if ((!this.login.senha) || (this.login.senha === '')) {
        this.notification.warning('Atenção', 'Senha não informada');
      }
      this.isProcessando = false;
      return;
    }
    this.authHttpService.login(this.login).subscribe(response => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('idCli', response.idCli);
      localStorage.setItem('idUsuario', response.idUsuario);
      this.isProcessando = false;
      this.Sucesso();
      }, err => {
        this.isProcessando = false;
        this.notification.warning('Login', err.error.mensagem);
      }
    )
  }


  async Sucesso() {
    await this.zone.run(() => this.router.navigate(['/mensagens']));
  }




  onGoogleClick(token: any) {
    this.isProcessando = true;

    if (token) {
      //this.authService.onGoogleLogin(token, this.Sucesso.bind(this), this.Erro.bind(this));
    }
  }


  async cadastrarUsuario() {
    const modalRef = this.modalService.open(ModalNovoUsuarioComponent, { keyboard: false,  centered: true, size: 'lg', backdrop: false, windowClass: 'custom-modal-center modal-xl'});

    modalRef.result.then((result) => {
      this.iniciarContagemRegressiva();

      this.clienteHttpService.inserir(result).subscribe(async response => {
        this.usuario = response.usuario;
        this.login.email = result.email;
        this.login.senha = result.senha;
        await Utils.createApiInstance(this.terminalHttpService,
          this.whatsappHttpService,this.notification,this.usuario);
        this.loginByNewUser();
        this.notification.success('Sucesso', 'Usuário cadastrado com sucesso');
        this.finalizarProcessamento();
      }, err => {
        this.isProcessando = false;
        this.isProcessandoNewUser = false;
        this.notification.warning('Login', err.error.mensagem);
        this.finalizarProcessamento();
      })
    }, (reason) => {
    });
  }

  // async createApiInstance() {
  //   try {
  //     // Obter a apiKey
  //     const response = (await this.terminalHttpService.getApiKey().toPromise());

  //     // Verificar se a apiKey está vazia
  //     const apiKey = response?.apikey || ''; // Acessa a chave "apikey" no retorno JSON

  //     if (!apiKey) {
  //       // Emitir notificação e sair da rotina
  //       this.notification.error('Erro', 'Erro ao conectar no telefone');
  //       return; // Sai da rotina se a apiKey for uma string vazia
  //     }

  //     // Criar a instância com a apiKey obtida
  //     const retorno =  await this.whatsappHttpService.createInstance(
  //       this.usuario.apiurl, environment.defaultApiKey , this.usuario.apiinstanceid, apiKey);

  //     // Verificar o retorno e notificar o usuário
  //     if (retorno) {
  //         const terminal = {
  //           id: this.usuario.idtrm,
  //           apikey: apiKey
  //         }
  //         this.terminalHttpService.updateApiKey(terminal).subscribe({
  //           next: () => {
  //             this.notification.success('Informação', 'Instância criada com sucesso.');
  //           },
  //           error: (error) => {
  //             this.notification.error('Erro', 'Erro conectar no telefone');
  //             console.error('Erro conectar no telefone', error);
  //           }
  //         });
  //     } else {
  //         this.notification.info('Informação','Erro conectar no telefone.');
  //     }
  //   } catch(error) {
  //     // Tratamento de erro
  //     this.notification.error('Erro', 'Erro conectar no telefone');
  //     console.error('Erro ao criar a instância:', error);
  //   }
  // }

  loginByNewUser(): void {
    this.isProcessando = true;
    this.authHttpService.login(this.login).subscribe(response => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('idCli', response.idCli);
      localStorage.setItem('idUsuario', response.idUsuario);
      this.isProcessando = false;
      this.Sucesso();
      }, err => {
        this.isProcessando = false;
        this.notification.warning('Login', err.error.mensagem);
      }
    )
  }

  esqueceuSenha() {
    const modalRef = this.modalService.open(ModalRecuperarSenhaComponent, { keyboard: false,  centered: true, size: 'lg', backdrop: false, windowClass: 'custom-modal-password modal-xl'});

    modalRef.result.then((result) => {
      this.isProcessando = true;
      this.authHttpService.forgotPassword(result.email).subscribe(async response => {
        this.isProcessando = false;
        this.notification.success('Tudo certo', 'Foi enviado um email para você contendo as instruçoes para a troca da senha');
      }, err => {
        this.isProcessando = false;
        this.notification.warning('Erro', err.error.mensagem);
      })
    }, (reason) => {
    });
  }

  openResetPasswordModal(token: string) {
    const modalRef = this.modalService.open(ModalResetPasswordComponent, { keyboard: false,  centered: true, size: 'lg', backdrop: false, windowClass: 'custom-modal-password modal-xl'});

    modalRef.result.then((result) => {
      this.isProcessando = true;
      this.authHttpService.resetPassword(token, result.newPassword).subscribe(async response => {
        this.isProcessando = false;
        this.notification.success('Tudo certo', 'Senha atualizada com sucesso');
      }, err => {
        this.isProcessando = false;
        this.notification.warning('Erro', err.error.mensagem);
      })
    }, (reason) => {
    });
  }

  iniciarContagemRegressiva() {
    this.isProcessando = true;
    this.isProcessandoNewUser = true;
    this.tempoRestante = 120; // Ajuste o tempo para quanto você quiser
    this.intervalo = setInterval(() => {
      if (this.tempoRestante > 0) {
        this.tempoRestante--;
      } else {
        clearInterval(this.intervalo);
      }
    }, 1000);
  }

  finalizarProcessamento() {
    this.isProcessando = false;
    this.isProcessandoNewUser = false;
    clearInterval(this.intervalo); // Interrompe o temporizador
    this.tempoRestante = 120; // Reinicia o contador para o próximo uso
  }

  formatarTempo(tempo: number): string {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;
    return `${this.pad(minutos)}:${this.pad(segundos)}`;
  }

  pad(numero: number): string {
    return numero < 10 ? '0' + numero : numero.toString();
  }
}
