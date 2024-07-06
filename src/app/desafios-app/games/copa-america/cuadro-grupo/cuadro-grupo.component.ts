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
  filteredPartidos: any = [];
  filtroActivo: string = 'all';
  formatFecha(fecha: Date): string {
    const formattedDate = formatDate(fecha, 'EEE, dd/MM/yyyy', 'es-AR');
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  constructor(private _copaAmericaService: CopaAmericaService) { }

  ngOnInit(): void {
    this._copaAmericaService.match_list().subscribe(
      (response: any) => {
        this.partidos = response.data;
        this.partidos.sort((a: { date: string; group: string; }, b: { date: string; group: any; }) => {
          const dateA = this.formatDate(a.date);
          const dateB = this.formatDate(b.date);
          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;
          return a.group.localeCompare(b.group);
        });
        this.filter('next'); // Aplicar filtro 'next' por defecto
      },
      (error) => {
        console.error('Error al obtener los partidos:', error);
      }
    );
  }

  formatDate(dateString: string): string {
    if (!dateString) {
      return '';
    }

    const [dayMonthYear, time] = dateString.split(' ');
    const [day, month, year] = dayMonthYear.split('/');
    const [hours, minutes] = time.split(':');
    // Formato deseado: yyyyMMddhhmm
    return `${year}${month}${day}${hours}${minutes}`;
  }

  calcularTiempoRestante(fechaPartidoStr: string): string {
    if (!fechaPartidoStr) {
      return '';
    }

    const fechaPartido = new Date(fechaPartidoStr);
    const ahora = new Date();
    let diferencia = fechaPartido.getTime() - ahora.getTime();

    if (diferencia < 0) {
      diferencia = 0;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    return `${dias} d ${horas} h ${minutos} m ${segundos} s`;
  }

  filter(type: string) {
    this.filtroActivo = type;
    if (type === 'next') {
      this.filteredPartidos = this.partidos.filter((partido: any) => partido.state !== 'Finalizado');
    } else if (type === 'previous') {
      this.filteredPartidos = this.partidos.filter((partido: any) => partido.state === 'Finalizado');
    } else if (type === 'all') {
      this.filteredPartidos = this.partidos;
    }
    console.log(`Filtro aplicado: ${type}`);
  }
}