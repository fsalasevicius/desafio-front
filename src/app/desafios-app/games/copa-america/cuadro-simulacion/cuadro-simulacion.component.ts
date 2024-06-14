import { Component, OnInit } from '@angular/core';
import { CopaAmericaService } from 'src/app/services/copa-america.service';
import { formatDate } from '@angular/common';
export interface Partido {
  grupo: string;
  fechaHora: string;
  nombreEquipo: string;
  escudoEquipo: string;
  puntos: number;
  partidosJugados: number;
  partidosGanados: number;
  partidosEmpatados: number;
  partidosPerdidos: number;
  gd: number;
  gf: number;
  gc: number;
}

@Component({
  selector: 'app-cuadro-simulacion',
  templateUrl: './cuadro-simulacion.component.html',
  styleUrls: ['./cuadro-simulacion.component.scss']
})
export class CuadroSimulacionComponent implements OnInit {
  loading = true;
  partidos: any = [];
  formatFecha(fecha: Date): string {
    const formattedDate = formatDate(fecha, 'EEE, dd/MM/yyyy', 'es-AR');
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  constructor(
    private _copaAmericaService: CopaAmericaService,) { }

    ngOnInit(): void {
      this.loading = true;
      this._copaAmericaService.table_resultados().subscribe(
        (response: any) => {
          this.partidos = response.data;

          console.log(this.partidos)
        },
        (error) => {
          console.error('Error al obtener los partidos:', error);
          this.loading = false;
        }
      );
    }
    
    // Función para convertir la fecha y hora a un formato comparable
    formatDate(dateString: string): string {
      const [dayMonthYear, time] = dateString.split(' ');
      const [day, month, year] = dayMonthYear.split('/');
      const [hours, minutes] = time.split(':');
      return `${year}${month}${day}${hours}${minutes}`;
    }

}
