import { Component, OnInit } from '@angular/core';
import { CopaAmericaService } from 'src/app/services/copa-america.service';

interface Team {
  conf: string;
  createdAt: string;
  flag: string;
  name: string;
  nid: number;
  goles: number;
}

interface Match {
  createdAt: string;
  date: string;
  fase: string;
  group: string;
  ticket: string;
  nmatch: number;
  stadium: Stadium[];
  teamA: Team[];
  teamB: Team[];
}

interface Stadium {
  createdAt: string;
  estado: string;
  img: string;
  localidad: string;
  name: string;
  nstadium: number;
}


@Component({
  selector: 'app-copa-america',
  templateUrl: './copa-america.component.html',
  styleUrls: ['./copa-america.component.scss']
})
export class CopaAmericaComponent implements OnInit {
  public dataMatches: Match[] = [];
  public grupos: any[] = [];
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
    });
  }

  getGoles(team: Team[]): number {
    return team && team.length > 0 ? team[0].goles : 0;
  }
  
  setGoles(team: Team[], goles: number) {
    if (team && team.length > 0) {
      team[0].goles = goles;
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
      grupo.partidos.forEach((partido: { teamA: { goles: number; }; teamB: { goles: number; }; }) => {
        const golesEquipoA = partido.teamA?.goles ?? 0;
        const golesEquipoB = partido.teamB?.goles ?? 0;
  
        console.log(`Goles Equipo A: ${golesEquipoA}, Goles Equipo B: ${golesEquipoB}`);
      });
    });
  }
}