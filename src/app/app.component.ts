import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Curso Angular';

  items: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-fw pi-home',
      routerLink: 'dashboard',
    },
    {
      label: 'Coches',
      icon: 'pi pi-fw pi-car',
      routerLink: 'products',
    },
    {
      label: 'Calendario',
      icon: 'pi pi-fw pi-calendar',
      routerLink: 'calendar',
    },
  ];
  activeItem = this.items[0];

  constructor(private config: PrimeNGConfig) { }

  ngOnInit() {
    this.config.setTranslation({
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      emptyMessage: 'Sin resultados',
      emptyFilterMessage: 'Sin resultados',
      accept: 'Sí',
      reject: 'No',
    });
  }
}
