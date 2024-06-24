import { Component, OnInit } from '@angular/core';
import { CopaAmericaService } from 'src/app/services/copa-america.service';

@Component({
  selector: 'app-tabla-puntos',
  templateUrl: './cuadro-simulacion.component.html',
  styleUrls: ['./cuadro-simulacion.component.scss']
})
export class CuadroSimulacionComponent implements OnInit {   public groupStats: { [key: string]: { [teamId: string]: any } } = {};
public loading = true;
public groupedStats: { group: string, teams: { teamId: string, stats: any }[] }[] = [];

constructor(private _copaAmericaService: CopaAmericaService) {}
ngOnInit(): void {
  this._copaAmericaService.table_resultados().subscribe(
    response => {
      this.groupStats = response.groupStats;
      this.loading = false;
      console.log(this.groupStats);
      this.groupedStats = this.groupByGroup();
    },
    error => {
      console.error(error);
      this.loading = false;
    }
  );
}

getGroupNames() {
  return Object.keys(this.groupStats);
}

groupByGroup() {
  return Object.keys(this.groupStats)
    .sort() // Ordenar las claves de los grupos por orden alfabético
    .map(group => ({
      group,
      teams: Object.entries(this.groupStats[group]).map(([teamId, stats]) => ({ teamId, stats }))
    }));
}
}