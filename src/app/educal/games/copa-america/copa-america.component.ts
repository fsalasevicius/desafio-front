import { Component, OnInit } from '@angular/core';
import { Match, Team } from 'src/app/interface/copa-america.interface';
import { CopaAmericaService } from 'src/app/services/copa-america.service';

@Component({
  selector: 'app-copa-america',
  templateUrl: './copa-america.component.html',
  styleUrls: ['./copa-america.component.scss']
})
export class CopaAmericaComponent implements OnInit {
  public dataMatches: Match[] = [];
  public grupos: any[] = [];
  public loading: boolean = true;
  constructor(private _copaamerica: CopaAmericaService) {}

  ngOnInit(): void {
    this._copaamerica.stadium_list().subscribe(response => {
      console.log(response);
    });
    this._copaamerica.country_list().subscribe(response => {
      console.log(response);
    });
    this._copaamerica.match_list().subscribe(response => {
      this.dataMatches = response.data;
      console.log(this.dataMatches)
      this.organizeMatchesByGroup();
      this.loading = false;
    });
  }

  getGoles(equipo: Team[], partidoIndex: number): number {
    return equipo && equipo[partidoIndex] ? equipo[partidoIndex].goles : 0;
  }
  
  setGoles(equipo: Team[], partidoIndex: number, goles: number) {
    if (equipo && equipo[partidoIndex]) {
      equipo[partidoIndex].goles = goles;
    }
  }

  organizeMatchesByGroup() {
    const groupedMatches: { [key: string]: Match[] } = {};
  
    this.dataMatches.forEach(match => {
      if (!groupedMatches[match.group]) {
        groupedMatches[match.group] = [];
      }
      groupedMatches[match.group].push(match);
    });
  
    console.log(groupedMatches); // Verifica que los partidos se agrupen correctamente
  
    this.grupos = Object.keys(groupedMatches).map(group => ({
      nombre: group,
      partidos: groupedMatches[group]
    }));
  }

  grabarPrediccion() {
    this.grupos.forEach((grupo) => {
      if (grupo && grupo.partidos) {
        grupo.partidos.forEach((partido: { teamA: { goles: number; }[]; teamB: { goles: number; }[]; }) => {
          if (partido && partido.teamA && partido.teamB) {
            const golesEquipoA = partido.teamA[0]?.goles ?? 0;
            const golesEquipoB = partido.teamB[0]?.goles ?? 0;
    
            console.log(`Goles Equipo A: ${golesEquipoA}, Goles Equipo B: ${golesEquipoB}`);
          }
        });
      }
    });
  }
}