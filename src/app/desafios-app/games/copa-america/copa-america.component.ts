import { Component, HostListener, OnInit } from '@angular/core';
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
  isSmallScreen: boolean = false;

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
    this.checkScreenSize();
    if (this.user && this.token) {
      this._copaAmericaService.view_prediction(this.user, this.token).subscribe(
        (response) => {
          this.userPredictions = response.data[0]?.predictions || [];
          this.prediccion = this.userPredictions.length > 0;
          this.loadMatches();
        },
        (error) => {
          console.error('Error al obtener predicciones del usuario:', error);
          this.loadMatches(); // Intentar cargar los partidos aunque haya error con predicciones
        }
      );
      // this._copaAmericaService.table_prediction(this.user, this.token).subscribe(
      //   (response) => {
      //   }
      // );
      this._copaAmericaService.table_resultados().subscribe(
        (response) => {
        }
      );


    } else {
      this.loadMatches();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
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
          let hasWarnings = false; // Variable para verificar si hay advertencias
          if (response.messages && response.messages.length > 0) {
            hasWarnings = true; // Hay advertencias
            response.messages.forEach((msg: string) => {
              this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: msg,
              });
            });
          }
    
          if (!hasWarnings) {
            // Solo mostrar el mensaje de éxito si no hay advertencias
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

  getWinnerData(pIndex: number): { name: string; flag: string } {
    const partido = this.matches[pIndex];
    const teamA = this.predictionForm.get(['predictions', pIndex, 'predictedScore', 'teamA'])?.value;
    const teamB = this.predictionForm.get(['predictions', pIndex, 'predictedScore', 'teamB'])?.value;
  
    if (teamA === null || teamB === null || teamA < 0 || teamB < 0) {
      return { name: '', flag: '' };
    }
  
    const winnerName = teamA > teamB ? partido.teamA.name : teamA < teamB ? partido.teamB.name : 'Empate';
    const winnerFlag = teamA > teamB ? partido.teamA.flag : teamA < teamB ? partido.teamB.flag : '';
  
    // Si es un empate, no mostrar la bandera
    if (winnerName === 'Empate') {
      return { name: winnerName, flag: '' };
    }
  
    return { name: winnerName, flag: winnerFlag };
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