import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Match } from 'src/app/interface/copa-america.interface';
import { CopaAmericaService } from 'src/app/services/copa-america.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-copa-america',
  templateUrl: './copa-america.component.html',
  styleUrls: ['./copa-america.component.scss'],
})
export class CopaAmericaComponent implements OnInit {
  public token = localStorage.getItem('authToken');
  user: any = undefined;
  userId: any;
  predictionForm!: FormGroup;
  matches: Match[] = [];
  loading = true;
  prediccion = false;
  userPredictions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private _copaAmericaService: CopaAmericaService,
    private _messageService: MessageService
  ) {
    if (this.token) {
      let obj_lc: any = localStorage.getItem('userData');
      this.user = JSON.parse(obj_lc);
    }

    this.predictionForm = this.fb.group({
      predictions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.user && this.token) {
      this._copaAmericaService.view_prediction(this.user, this.token).subscribe(
        (response) => {
          this.userPredictions = response.data[0]?.predictions || [];
          this.prediccion = this.userPredictions.length > 0;
          console.log(this.userPredictions)
          console.log('Predicciones del usuario:', this.userPredictions);
          this.loadMatches();
        },
        (error) => {
          console.error('Error al obtener predicciones del usuario:', error);
          this.loadMatches(); // Intentar cargar los partidos aunque haya error con predicciones
        }
      );
      // this._copaAmericaService.table_prediction(this.user, this.token).subscribe(
      //   (response) => {
      //   console.log(response)
      //   }
      // );
      this._copaAmericaService.table_resultados().subscribe(
        (response) => {
        console.log(response)
        }
      );


    } else {
      this.loadMatches();
    }
  }

  loadMatches(): void {
    this._copaAmericaService.match_list().subscribe(
      (response: any) => {
        this.matches = response.data;
        if (Array.isArray(this.matches)) {
          this.matches.sort((a, b) => a.nmatch - b.nmatch);
          this.initializeForm();
          this.loading = false;
        } else {
          console.error('La respuesta de la API no es un array:', this.matches);
          this.loading = false;
        }
      },
      (error) => {
        console.error('Error al obtener los partidos:', error);
        this.loading = false;
      }
    );
  }

  initializeForm() {
    const predictionsArray = this.predictionForm.get('predictions') as FormArray;
    predictionsArray.clear(); // Clear the form array to avoid duplicates

    this.matches.forEach((partido) => {
      const existingPrediction = this.userPredictions.find(
        (pred: any) => pred.matchId === partido._id
      );

      const partidoFormGroup = this.fb.group({
        matchId: [partido._id, Validators.required],
        user: this.user ? this.user._id : null,
        predictedScore: this.fb.group({
          teamA: [existingPrediction ? existingPrediction.predictedScore.teamA : '', Validators.required],
          teamB: [existingPrediction ? existingPrediction.predictedScore.teamB : '', Validators.required],
        }),
      });

      predictionsArray.push(partidoFormGroup);
    });

    this.predictionForm.markAllAsTouched();
    console.log('Formulario inicializado:', this.predictionForm.value);
  }

  onSubmit(): void {
    if (this.predictionForm.invalid) {
      this.predictionForm.markAllAsTouched();
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Faltan realizar predicciones.',
      });
      return;
    } else {
      const predictionsData = this.predictionForm.value.predictions.map(
        (prediction: any, index: number) => {
          const matchId = this.matches[index]._id; // Obtener el ID correcto del partido

          // Verificar que el ID del partido en predictedScore coincida con el ID correcto
          if (prediction.matchId !== matchId) {
            console.error('ID del partido incorrecto:', prediction.matchId);
            return null; // Devolver null para indicar un error
          }

          return {
            ...prediction,
            matchId,
          };
        }
      );

      // Verificar si hay errores antes de enviar la solicitud al backend
      if (predictionsData.includes(null)) {
        console.error('Error en las predicciones.');
        return;
      }

      this._copaAmericaService
        .register_prediction({ predictions: predictionsData }, this.token)
        .subscribe(
          (response) => {
            if (response.data === undefined) {
              this._messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: response.message,
              });
            } else {
              this._messageService.add({
                severity: 'success',
                summary: 'Proceso Exitoso!',
                detail: "Guardando Predicción",
              });
            }
          },
          (err) => {
            this._messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: err.message,
            });
          }
        );
    }
  }

  get predictions(): FormArray {
    return this.predictionForm.get('predictions') as FormArray;
  }

  getWinnerName(pIndex: number): string {
    const teamAName = this.matches[pIndex].teamA.name;
    const teamBName = this.matches[pIndex].teamB.name;
    const teamA = this.predictionForm.get([
      'predictions',
      pIndex,
      'predictedScore',
      'teamA',
    ])?.value;
    const teamB = this.predictionForm.get([
      'predictions',
      pIndex,
      'predictedScore',
      'teamB',
    ])?.value;

    if (
      teamA === '' ||
      teamB === '' ||
      teamA === null ||
      teamB === null ||
      teamA < 0 ||
      teamB < 0
    ) {
      return ''; 
    }

    if (teamA > teamB) {
      return teamAName; 
    } else if (teamA < teamB) {
      return teamBName; 
    } else {
      return 'Empate'; 
    }
  }

  clearPredictions(): void {
    this.predictionForm.reset();
    this.initializeForm(); // Reinitialize the form to reset it completely
    this._messageService.add({
      severity: 'info',
      summary: 'Predicciones borradas',
      detail: 'Tus predicciones actuales han sido borradas. Si te arrepentiste recarga la pagina.',
    });
  }
}