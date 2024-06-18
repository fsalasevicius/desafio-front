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
  selector: 'app-cuadro-grupo',
  templateUrl: './cuadro-grupo.component.html',
  styleUrls: ['./cuadro-grupo.component.scss']
})
export class CuadroGrupoComponent implements OnInit {
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
      this._copaAmericaService.match_list().subscribe(
        (response: any) => {
          this.partidos = response.data;
          this.partidos.sort((a: { date: string; group: string; }, b: { date: string; group: any; }) => {
            // Convertir las fechas a formato comparable (ej. dd/MM/yyyy hh:mm -> yyyyMMddhhmm)
            const dateA = this.formatDate(a.date);
            const dateB = this.formatDate(b.date);
    
            // Comparar las fechas y luego los grupos si las fechas son iguales
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
            return a.group.localeCompare(b.group);
          });
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
