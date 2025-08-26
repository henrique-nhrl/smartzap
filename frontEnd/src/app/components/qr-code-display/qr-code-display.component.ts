import { WhatsappHttpService } from 'src/app/services/whatsapp-http.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/entities/usuario';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-qr-code-display',
  templateUrl: './qr-code-display.component.html',
  styleUrls: ['./qr-code-display.component.scss']
})
export class QrCodeDisplayComponent implements OnInit, OnDestroy {

  @Input() usuario: Usuario;

  public qrCode: string = '';
  private updateInterval: any;
  private updateConect: any;
  private conectado: boolean = false;
  qrCodeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private whatsappHttpService: WhatsappHttpService) {
    this.qrCodeForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadQRCode();
    this.startQRCodeUpdates();
    this.startCheckConect();
  }

  onSubmit() {
    this.activeModal.close(this.conectado);
  }

  loadQRCode(): void {
    // Aqui você pode substituir pelo método que realmente carrega o QR code da sua API
    this.GetQRCODE();
  }

  startQRCodeUpdates(): void {
    this.updateInterval = setInterval(() => {
        this.loadQRCode();
    }, 15000); // Atualiza a cada 30 segundos
  }

  startCheckConect(): void {
    this.updateConect = setInterval(async () => {
    this.conectado = (await this.CheckInstanceConnection());
    if (this.conectado) {
      this.onSubmit()
    };
    }, 5000); // Atualiza a cada 3 segundos
  }

  async CheckInstanceConnection(): Promise<boolean> {
    if (this.usuario.apienabled == 'N') return false;
    try {
      const isConected = await firstValueFrom(this.whatsappHttpService.CheckInstanceConnection(this.usuario.apiurl, this.usuario.apiinstanceid, this.usuario.apikey));
      return isConected as boolean;
    } catch(error) {
      console.error('Erro ao verificar a conexão:', error);
      return false;
    }
  }

  GetQRCODE() {
    this.whatsappHttpService.GetQRCODE(this.usuario.apiurl, this.usuario.apiinstanceid, this.usuario.apikey).subscribe(
      instance => {
        if (instance) {
           this.qrCode = instance;
        } else {
          //this.aviso('Atenção','Você não está conectado');
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.stopCheckConectUpdates();
    this.stopQRCodeUpdates();
  }

  stopQRCodeUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  stopCheckConectUpdates(): void {
    if (this.updateConect) {
      clearInterval(this.updateConect);
    }
  }



}
