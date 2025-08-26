import { Component, OnInit, NgZone, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {

  @Input() empresa: string;
  @Input() usuario: string;

  navbarOpen = false;

  constructor(
    private zone: NgZone,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onLogout(){
    localStorage.removeItem('token');
    localStorage.removeItem('idCli');
    localStorage.removeItem('idUsuario');
    this.zone.run(() => this.router.navigate(['/login']));
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  onCloseNavbar(){
    this.toggleNavbar();
  }

  getClass() {
    return this.navbarOpen ? "nav-link text-black" : "nav-link text-white fw-bold";
  }

}
