import { CupomHttpService } from './../../services/cupom-http.service';
import { WhatsappHttpService } from './../../services/whatsapp-http.service';
import { Cliente } from './../../entities/cliente';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AreaHttpService } from 'src/app/services/area-http.service';
import { Area } from 'src/app/entities/area';
import { AuthHttpService } from 'src/app/services/auth-http.service';
import { first, firstValueFrom } from 'rxjs';
import { Usuario } from 'src/app/entities/usuario';
import { Utils } from 'src/app/utils/utils';
import { Cupom } from 'src/app/entities/cupom';

@Component({
  selector: 'app-modal-novo-usuario',
  templateUrl: './modal-novo-usuario.component.html',
  styleUrls: ['./modal-novo-usuario.component.scss']
})
export class ModalNovoUsuarioComponent implements OnInit {

  public cliente: Cliente;
  public confirmarSenha: string;
  public areas: Area[] = [];
  private usuarioEmpresa: Usuario;
  public cupom: Cupom = new Cupom();

  @Output() valueUpdated = new EventEmitter<string>();

  constructor(public activeModal: NgbActiveModal,
    private notification: NzNotificationService,
    private areaHttpService: AreaHttpService,
    private usuarioHttpService: AuthHttpService,
    private whatsappHttpService: WhatsappHttpService,
    private cupomHttpService: CupomHttpService
  ) {
    this.cliente = new Cliente();
    this.cupom.id = 0;
    this.cupom.nome = '';
    this.cupom.validade = new Date();
   }

  ngOnInit(): void {
    this.carregarAreas();
    this.carregarUsuario();
  }


  handleCancel(): void {
    this.activeModal.dismiss('cancel');
  }

  async handleUpdate() {
    if (await this.validar()) {
      const response = {
        nome: this.cliente.nome,
        responsavel: this.cliente.responsavel,
        telefone: this.cliente.telefone,
        email: this.cliente.email,
        senha: this.cliente.senha,
        idarea: this.cliente.idarea,
        idcupom: this.cliente.idCupom == 0 ? null : this.cliente.idCupom
      }
      this.activeModal.close(response);
    }
  }

  async validar() {
    try {
    if(!this.cliente.nome) {
      this.notification.info('Informação','Informe o nome');
      const el = document.getElementById('nome');
      el?.focus();
      return false;
    }
    if(!this.cliente.responsavel) {
      this.notification.info('Informação','Informe o usuário');
      const el = document.getElementById('responsavel');
      el?.focus();
      return false;
    }
    if(!this.cliente.telefone) {
      this.notification.info('Informação','Informe o telefone');
      const el = document.getElementById('telefone');
      el?.focus();
      return false;
    }
    const exists: boolean = (await this.whatsappHttpService.checkWhatsAppNumber(this.usuarioEmpresa.apiurl,
      this.usuarioEmpresa.apiinstanceid, this.usuarioEmpresa.apikey, this.cliente.telefone).pipe(first()).toPromise().then()) as boolean;

    if (!exists) {
      this.notification.info('Atenção','O número informado não possui WhatsApp')
      return false;
    }

    if(!this.cliente.email) {
      this.notification.info('Informação','Informe o email');
      const el = document.getElementById('email');
      el?.focus();
      return false;
    }
    const emailValido = await Utils.validateEmail(this.cliente.email);
    if(!emailValido) {
      this.notification.info('Informação','E-mail inválido');
      const el = document.getElementById('email');
      el?.focus();
      return false;
    }
    const existsEmail: boolean = (await this.emailExiste(this.cliente.email)) as boolean;
    if(existsEmail){
      this.notification.info('Informação','E-mail já cadastrado');
      const el = document.getElementById('email');
      el?.focus();
      return false;
    }
    if(!this.cliente.idarea) {
      this.notification.info('Informação','Informe a área');
      const el = document.getElementById('selectArea');
      el?.focus();
      return false;
    }
    if(!this.cliente.senha || this.cliente.senha.length < 6) {
      this.notification.info('Informação','A senha deve conter pelo menos 6 caracteres');
      const el = document.getElementById('senha');
      el?.focus();
      return false;
    }
    if(this.cliente.senha !== this.confirmarSenha) {
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

  async carregarAreas() {
    this.areaHttpService.getAll().subscribe(areas => {
        areas.forEach(p => {
          this.areas.push({
            id: p.id,
            nome: p.nome,
            inativo: p.inativo
          });
        });
      }
    );
  }

  async emailExiste(email: string): Promise<boolean> {
    try {
      const usuario = await firstValueFrom(this.usuarioHttpService.getByEmail(email));
      return !! usuario;
    } catch(error) {
      return false;
    }
  }

  async carregarUsuario() {
    const usuario = (await this.usuarioHttpService.getUsuarioEmpresa().pipe(first()).toPromise().then()) as Usuario[];
    this.usuarioEmpresa = {
      id: usuario[0].id,
      idcli: usuario[0].idcli,
      idtrm: usuario[0].idtrm,
      nome: usuario[0].nome,
      email: usuario[0].email,
      pwp: '',
      admin: usuario[0].admin,
      inativo: usuario[0].inativo,
      empresanome: usuario[0].empresanome,
      numtel: usuario[0].numtel,
      apiurl: usuario[0].apiurl,
      apiinstanceid: usuario[0].apiinstanceid,
      apikey: usuario[0].apikey,
      apienabled: usuario[0].apienabled
    };
  }

  async aplicarCupom() {
    if(!this.cupom.nome){
      this.notification.warning('Atenção', 'Cupom não informado');
      return;
    }
    this.cupomHttpService.buscarPorNome(this.cupom.nome).subscribe(cupom => {
      this.cupom = {
        id: cupom[0].id,
        nome: cupom[0].nome,
        validade: new Date(cupom[0].validade)
      };
      if (!this.cupomValido()) {
        this.limparCupom();
        this.notification.info('Atenção','Cupom Inváldo ou Expirado');
      };
      this.cliente.idCupom = this.cupom.id;

    }, err => {
      this.notification.warning('Atenção', err.error.mensagem);
    });
  }

  limparCupom() {
    this.cupom = new Cupom();
    this.cupom.id = 0;
    this.cupom.nome = '';
    this.cupom.validade = new Date();
    this.cliente.idCupom = 0;
  }

  cupomValido(): boolean {
    const hoje = new Date();
    // Zera as horas, minutos, segundos e milissegundos para a comparação
    hoje.setHours(0, 0, 0, 0);
    const validade = new Date(this.cupom.validade);
    validade.setHours(0, 0, 0, 0);

    return validade >= hoje;
  }

  aplicarOuRemoverCupom() {
    if (this.cliente.idCupom > 0) {
      this.limparCupom();
    } else {
      this.aplicarCupom();
    }
  }


}
