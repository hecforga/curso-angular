import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Curso Angular';

  constructor(private config: PrimeNGConfig) { }

    ngOnInit() {
        this.config.setTranslation({
          monthNames: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
          emptyMessage: 'Sin resultados',
          emptyFilterMessage: 'Sin resultados',
        });
    }
}
