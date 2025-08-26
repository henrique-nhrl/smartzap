import {Component, OnInit, AfterViewInit, ElementRef, Input, Output, EventEmitter} from '@angular/core';

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
  selector: 'app-google-button',
  templateUrl: './google-button.component.html',
  styleUrls: ['./google-button.component.scss']
})
export class GoogleButtonComponent implements OnInit, AfterViewInit {

  @Input() classes: string;
  @Input() text: string;
  @Input() loading: boolean;
  @Input() execute: boolean;
  @Output() tokenAtualizado = new EventEmitter();

  constructor(
    private element: ElementRef) {

  }

  private clientId: string = '603118213649-coidd0jil5tvu2ioucihs5tanc36ib27.apps.googleusercontent.com';

  private scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/plus.me',
    // 'https://www.googleapis.com/auth/contacts.readonly',
    // 'https://www.googleapis.com/auth/admin.directory.user.readonly'
  ].join(' ');

  public auth2: any;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.googleInit();
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: this.clientId,
        cookiepolicy: 'single_host_origin',
        scope: this.scope
      });
      this.attachSignin(this.element.nativeElement.firstChild);
    });
  }

  public attachSignin(element: any) {
    this.auth2.attachClickHandler(element, {},
      (googleUser: any) => {
        this.tokenAtualizado.emit(googleUser.getAuthResponse().id_token);
        const profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
      }, function (error: any) {
        console.log(error);
      });
  }

  firstClicked() {
    if (!this.execute) {
      return;
    }
    this.tokenAtualizado.emit(null);
  }
}
