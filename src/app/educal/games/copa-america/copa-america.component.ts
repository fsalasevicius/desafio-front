import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Match } from 'src/app/interface/copa-america.interface';
import { CopaAmericaService } from 'src/app/services/copa-america.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-copa-america',
  templateUrl: './copa-america.component.html',
  styleUrls: ['./copa-america.component.scss']
})
export class CopaAmericaComponent implements OnInit {
  public token = localStorage.getItem('authToken');
  user: string | null | undefined;
  userId: any;
  predictionForm!: FormGroup;
  matches: Match[] = [];
  loading = true;
  grupos: { nombre: string, partidos: Match[] }[] = [];
  userPredictions: any[] = [];
  constructor(
    private fb: FormBuilder, 
    private _copaAmericaService: CopaAmericaService, 
    private _messageService: MessageService
  ) {
    this.user = localStorage.getItem('userData');
    this.predictionForm = this.fb.group({
      predictions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.userId = this.getUserId();
    if (!this.userId) {
      console.error('No se pudo obtener el userId.');
      return;
    }
    this._copaAmericaService.view_prediction(this.userId,this.token).subscribe(
      response =>{
        console.log(response)
      });
    this._copaAmericaService.match_list().subscribe(
      (response: any) => {
        this.matches = response.data;
        if (Array.isArray(this.matches)) {
          this.matches.sort((a, b) => a.nmatch - b.nmatch);  // Ordenar por nmatch o _id
          this.groupMatches();
          this.initializeForm();
          this.loading = false;
        } else {
          console.error('La respuesta de la API no es un array:', this.matches);
          this.loading = false;
        }
      },
      error => {
        console.error('Error al obtener los partidos:', error);
        this.loading = false;
      }
    );
  }

  getUserId(): string | null {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        this.userId = userData._id;
        return userData._id;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return null;
  }

  initializeForm() {
    const predictionsArray = this.predictionForm.get('predictions') as FormArray;
    this.matches.forEach((partido) => {
      const partidoFormGroup = this.fb.group({
        matchId: [partido._id, Validators.required],
        user: this.getUserId(),
        predictedScore: this.fb.group({
          teamA: ['', Validators.required],
          teamB: ['', Validators.required]
        }),
      });
      predictionsArray.push(partidoFormGroup);
    });

    // Marcar el formulario como 'touched' después de inicializarlo
    this.predictionForm.markAllAsTouched();
  }

  groupMatches(): void {
    const groupedMatches: { [key: string]: Match[] } = {};
    this.matches.forEach(match => {
      if (!groupedMatches[match.group]) {
        groupedMatches[match.group] = [];
      }
      groupedMatches[match.group].push(match);
    });

    this.grupos = Object.keys(groupedMatches).sort().map(grupo => ({
      nombre: `Grupo ${grupo}`,
      partidos: groupedMatches[grupo]
    }));
  }

  onSubmit(): void {
    if (this.predictionForm.invalid) {
      this.predictionForm.markAllAsTouched();
      this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Faltan realizar predicciones.' });
      return;
    } else {
      const predictionsData = this.predictionForm.value.predictions.map((prediction: any, index: number) => {
        const matchId = this.matches[index]._id;
        return {
          ...prediction,
          matchId
        };
      });

      console.log(predictionsData);

      this._copaAmericaService.register_prediction({ predictions: predictionsData }, this.token).subscribe(
        response => {
          if (response.data === undefined) {
            this._messageService.add({ severity: 'error', summary: 'Error!', detail: response.message });
          } else {
            this._messageService.add({ severity: 'success', summary: 'Proceso Exitoso!', detail: response.data });
          }
        },
        err => {
          this._messageService.add({ severity: 'error', summary: 'Error!', detail: err.message });
        }
      );
    }
  }

  get predictions(): FormArray {
    return this.predictionForm.get('predictions') as FormArray;
  }

  getWinnerName(gIndex: number, pIndex: number): string {
    const teamAName = this.grupos[gIndex].partidos[pIndex].teamA.name;
    const teamBName = this.grupos[gIndex].partidos[pIndex].teamB.name;
    const teamA = this.predictionForm.get(['predictions', this.getFormGroupIndex(gIndex, pIndex), 'predictedScore', 'teamA'])?.value;
    const teamB = this.predictionForm.get(['predictions', this.getFormGroupIndex(gIndex, pIndex), 'predictedScore', 'teamB'])?.value;

    if (teamA === '' || teamB === '' || teamA === null || teamB === null || teamA < 0 || teamB < 0) {
      return ''; // No mostrar nada si alguno de los goles está en blanco, es null o negativo
    }

    if (teamA > teamB) {
      return teamAName; // Nombre del equipo A si tiene más goles
    } else if (teamA < teamB) {
      return teamBName; // Nombre del equipo B si tiene más goles
    } else {
      return 'Empate'; // Empate si los goles son iguales
    }
  }

  getFormGroupIndex(gIndex: number, pIndex: number): number {
    return gIndex * this.grupos[gIndex].partidos.length + pIndex;
  }
}