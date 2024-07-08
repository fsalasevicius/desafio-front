import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Match } from 'src/app/interface/copa-america.interface';
import { CopaAmericaService } from 'src/app/services/copa-america.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {
  public token = localStorage.getItem('authToken');
  user: any = undefined;
  userId: any;
  predictionForm!: FormGroup;
  matches: Match[] = [];
  matchesAux: Match[] = [];
  loading = true;
  prediccion = false;
  activeBtn: boolean = true;
  faseActual: string = 'Semifinal';
  userPredictions: any[] = [];
  isSmallScreen: boolean = false;
  closedPredictionsCount: number = 0;

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
      this._copaAmericaService.table_resultados().subscribe(
        (response) => {}
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
        this.matchesAux = response.data;
        if (Array.isArray(this.matchesAux)) {
          this.changeForm(this.faseActual); // Filtrar por fase actual después de cargar los partidos
          this.matches.sort((a, b) => a.nmatch - b.nmatch);
          this.loading = false;
        } else {
          console.error('La respuesta de la API no es un array:', this.matchesAux);
          this.loading = false;
        }
      },
      (error) => {
        console.error('Error al obtener los partidos:', error);
        this.loading = false;
      }
    );
  }
  changeForm(param: string) {
    this.faseActual = param; // Actualizar la fase actual
    this.matches = this.matchesAux.filter(match => match.fase === param);
    this.matches.sort((a, b) => a.nmatch - b.nmatch); // Asegurar que los partidos estén ordenados
    this.activeBtn = param !== 'Grupos'; // Cambiar el estado del botón activo basado en la fase
    this.initializeForm();
  }

  initializeForm() {
    const predictionsArray = this.predictionForm.get('predictions') as FormArray;
    predictionsArray.clear(); // Clear the form array to avoid duplicates
    this.closedPredictionsCount = 0; // Reset closed predictions count

    this.matches.forEach((partido) => {
      const existingPrediction = this.userPredictions.find(
        (pred: any) => pred.matchId === partido._id
      );

      const partidoFormGroup = this.fb.group({
        matchId: [partido._id],
        user: this.user ? this.user._id : null,
        predictedScore: this.fb.group({
          teamA: [existingPrediction ? existingPrediction.predictedScore.teamA : ''],
          teamB: [existingPrediction ? existingPrediction.predictedScore.teamB : ''],
        }),
      });

      predictionsArray.push(partidoFormGroup);
    });
  }

  countClosedPredictions() {
    this.closedPredictionsCount = this.matches.filter(match => this.isPredictionClosed(match.date)).length;
  }


  isPredictionClosed(matchDate: string): boolean {
    const matchDateTime = new Date(matchDate).getTime();
    const now = new Date().getTime();
    return now > matchDateTime;
  }

  onSubmit(): void {
    let hasValidPrediction = false; // Variable bandera para indicar si al menos una predicción es válida
  
    const predictionsData = this.predictionForm.value.predictions.map(
      (prediction: any, index: number) => {
        const matchId = this.matches[index]._id;
        if (prediction.matchId !== matchId) {
          console.error('ID del partido incorrecto:', prediction.matchId);
          return null;
        }
  
        // Validar que al menos un campo tenga un valor numérico antes de enviar la predicción
        if ((prediction.predictedScore.teamA !== null && !isNaN(prediction.predictedScore.teamA)) || 
            (prediction.predictedScore.teamB !== null && !isNaN(prediction.predictedScore.teamB))) {
          hasValidPrediction = true; // Al menos una predicción es válida
          return {
            ...prediction,
            matchId,
          };
        } else {
          console.error('No se han ingresado predicciones válidas para el partido', matchId);
          return null;
        }
      }
    ).filter((prediction: any) => prediction !== null); // Filtrar las predicciones nulas
  
    // Verificar si no hay predicciones válidas antes de enviar la solicitud al backend
    if (!hasValidPrediction) {
      console.error('Debe completar al menos una predicción válida.');
      return;
    }
  
    this._copaAmericaService
      .register_prediction({ predictions: predictionsData }, this.token)
      .subscribe(
        (response) => {
          let hasWarnings = false;
          if (response.messages && response.messages.length > 0) {
            hasWarnings = true;
            response.messages.forEach((msg: string) => {
              this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: msg,
              });
            });
          }
  
          if (!hasWarnings) {
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

    if (winnerName === 'Empate') {
      return { name: winnerName, flag: '' };
    }

    return { name: winnerName, flag: winnerFlag };
  }

  clearPredictions(): void {
    this.predictionForm.reset();
    this.initializeForm();
    this._messageService.add({
      severity: 'info',
      summary: 'Predicciones borradas',
      detail: 'Tus predicciones actuales han sido borradas. Si te arrepentiste recarga la pagina.',
    });
  }

  calcularTiempoRestante(fechaPartidoStr: string): string {
    const fechaPartido = new Date(fechaPartidoStr);
    fechaPartido.setMinutes(fechaPartido.getMinutes() - 5); // Restar 5 minutos en lugar de 1 hora
    const ahora = new Date();
    let diferencia = fechaPartido.getTime() - ahora.getTime();

    if (diferencia < 0) {
        diferencia = 0;
    }

    if (diferencia === 0) {
        return 'Predicción cerrada';
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    return `${dias} d ${horas} h ${minutos} m ${segundos} s`;
}

}