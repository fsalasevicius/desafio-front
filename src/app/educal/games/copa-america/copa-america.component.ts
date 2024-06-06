import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Match, Team } from 'src/app/interface/copa-america.interface';
import { CopaAmericaService } from 'src/app/services/copa-america.service';

@Component({
  selector: 'app-copa-america',
  templateUrl: './copa-america.component.html',
  styleUrls: ['./copa-america.component.scss']
})
export class CopaAmericaComponent implements OnInit {
  predictionForm!: FormGroup;
  matches: Match[] = [];
  loading = true;
  grupos: { nombre: string, partidos: Match[] }[] = [];

  constructor(private fb: FormBuilder, private _copaAmericaService: CopaAmericaService) {}

  ngOnInit(): void {
    this.predictionForm = this.fb.group({
      predictions: this.fb.array([]) // Debe ser un FormArray vacío al principio
    });

    this._copaAmericaService.match_list().subscribe({
      next: (response: any) => {
        // Verificar si response.data es un array
        if (Array.isArray(response.data)) {
          this.matches = response.data.map((matchData: any) => {
            return {
              _id: matchData._id,
              nmatch: matchData.nmatch,
              teamA: matchData.teamA ? matchData.teamA : null,
              teamB: matchData.teamB ? matchData.teamB : null,
              date: matchData.date,
              stadium: matchData.stadium ? matchData.stadium : null,
              ticket: matchData.ticket,
              fase: matchData.fase,
              group: matchData.group,
              createdAt: matchData.createdAt
            };
          });
          this.groupMatches();
          this.addMatchControls();
          this.loading = false;
        } else {
          console.error('La respuesta de la API no es un array:', response.data);
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error al obtener los partidos:', error);
        this.loading = false;
      }
    });
  }

  private addMatchControls(): void {
    const predictionsFormArray = this.predictionForm.get('predictions') as FormArray;
    this.matches.forEach(match => {
      predictionsFormArray.push(this.createMatchGroup(match));
    });
  }

  private createMatchGroup(match: any): FormGroup {
    return this.fb.group({
      matchId: [match._id, Validators.required],
      predictedWinner: ['', Validators.required],
      predictedScore: this.fb.group({
        teamA: ['', Validators.required],
        teamB: ['', Validators.required]
      }),
      predictedGoalDifference: ['', Validators.required]
    });
  }

  groupMatches(): void {
    const groupedMatches: { [key: string]: any[] } = {};
    this.matches.forEach(match => {
      if (!groupedMatches[match.group]) {
        groupedMatches[match.group] = [];
      }
      groupedMatches[match.group].push(match);
    });

    this.grupos = Object.keys(groupedMatches).map(grupo => ({
      nombre: `Grupo ${grupo}`,
      partidos: groupedMatches[grupo]
    }));
  }

  onSubmit(): void {
    // Aquí puedes enviar los datos del formulario al servidor
    console.log(this.predictionForm.value);
  }

  get predictions(): FormArray {
    return this.predictionForm.get('predictions') as FormArray;
  }

  getFormGroupIndex(gIndex: number, pIndex: number): number {
    return gIndex * this.grupos[gIndex].partidos.length + pIndex;
  }
}