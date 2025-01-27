import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Team } from 'src/app/interface/copa-america.interface';
import { CopaAmericaService } from 'src/app/services/copa-america.service';
@Component({
  selector: 'app-top-tres',
  templateUrl: './top-tres.component.html',
  styleUrls: ['./top-tres.component.scss'],
})
export class TopTresComponent implements OnInit {
  loading = true;
  teams: Team[] = [];
  user: any = undefined;
  public token = localStorage.getItem('authToken');
  positionsForm: FormGroup;
  existingPredictions: any = null;
  days: number | undefined;
  hours!: number;
  minutes!: number;
  seconds!: number;
  showCountdown: boolean = true;

  constructor(
    private _fb: FormBuilder,
    private _messageService: MessageService,
    private _copaService: CopaAmericaService
  ) {
    if (this.token) {
      let obj_lc: any = localStorage.getItem('userData');
      this.user = JSON.parse(obj_lc);
    }
    this.positionsForm = this._fb.group({
      firstPlace: ['', Validators.required],
      secondPlace: ['', Validators.required],
      thirdPlace: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.startCountdown();

    this._copaService.view_prediction_top(this.user, this.token).subscribe(
      (response) => {
        if (response && response.data && response.data.length > 0) {
          this.existingPredictions = response.data[0]; 
          this.populateFormWithPredictions(); 
        } else {
          console.log('No se encontraron predicciones para el usuario');
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener las predicciones del usuario', error);
        this.loading = false;
      }
    );

    this._copaService.getTeamTournament().subscribe(
      (teams) => {
        this.teams = teams.data;
        if (this.existingPredictions) {
          const firstPlaceName = this.getTeamNameById(
            this.existingPredictions.firstPlace
          );
          const secondPlaceName = this.getTeamNameById(
            this.existingPredictions.secondPlace
          );
          const thirdPlaceName = this.getTeamNameById(
            this.existingPredictions.thirdPlace
          );

          this.positionsForm.patchValue({
            firstPlace: firstPlaceName,
            secondPlace: secondPlaceName,
            thirdPlace: thirdPlaceName,
          });
        }
      },
      (error) => {
        console.error('Error al obtener los equipos del torneo', error);
        this.loading = false;
      }
    );
  }

  populateFormWithPredictions(): void {
    if (this.existingPredictions) {
      const firstPlaceName = this.getTeamNameById(
        this.existingPredictions.firstPlace
      );
      const secondPlaceName = this.getTeamNameById(
        this.existingPredictions.secondPlace
      );
      const thirdPlaceName = this.getTeamNameById(
        this.existingPredictions.thirdPlace
      );
      this.positionsForm.patchValue({
        firstPlace: firstPlaceName,
        secondPlace: secondPlaceName,
        thirdPlace: thirdPlaceName,
      });
    }
  }
  getTeamNameById(id: string): string {
    const team = this.teams.find((t) => t._id.toString() === id);
    return team ? team.name : '';
  }

  validateSelection(
    place: 'firstPlace' | 'secondPlace' | 'thirdPlace',
    event: Event
  ) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value.trim();
    const isValid = this.teams.some((team) => team.name === selectedValue);
    if (isValid) {
      this.positionsForm.patchValue({
        [place]: selectedValue,
      });
    } else {
      this.positionsForm.patchValue({
        [place]: '',
      });
    }
  }

  savePredictions(): void {
    if (this.positionsForm.valid) {
      const predictions = { ...this.positionsForm.value };
  
      ['firstPlace', 'secondPlace', 'thirdPlace'].forEach((place) => {
        const teamName = predictions[place];
        const selectedTeam = this.teams.find((team) => team.name === teamName);
        if (selectedTeam) {
          predictions[place] = selectedTeam._id;
        }
      });
  
      predictions.user = this.user._id;
  
      const now = new Date();
      const deadlineDate = new Date('2024-07-04T21:55:00-03:00'); 
  
      if (now > deadlineDate) {
        this._messageService.add({
          severity: 'warn',
          summary: 'Fecha límite excedida',
          detail: 'Ya no es posible actualizar las predicciones. La fecha límite ha sido superada.'
        });
        return;
      }
  
      if (this.existingPredictions) {
        this._copaService.register_prediction_top(predictions, this.token).subscribe(
          (response) => {
            this._messageService.add({
              severity: 'success',
              summary: 'Operación Exitosa!',
              detail: 'Tu predicción ha sido actualizada.'
            });
          },
          (error) => {
            console.error('Error al actualizar las predicciones del podio', error);
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar las predicciones'
            });
          }
        );
      } else {
        this._copaService.register_prediction_top(predictions, this.token).subscribe(
          (response) => {
            this._messageService.add({
              severity: 'success',
              summary: 'Operación Exitosa!',
              detail: 'Tu predicción ha sido registrada.'
            });
          },
          (error) => {
            console.error('Error al guardar las predicciones del podio', error);
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Tu predicción no se ha guardado, intenta nuevamente mas tarde.'
            });
          }
        );
      }
    }
  }

  clearField(place: 'firstPlace' | 'secondPlace' | 'thirdPlace'): void {
    const formControl = this.positionsForm?.get(place);
    if (formControl) {
      formControl.reset(); 
    } else {
      console.error(
        `El formulario o el campo ${place} no están inicializados correctamente.`
      );
    }
  }

 
  startCountdown(): void {
    const countDownDate = new Date('Jul 04, 2024 21:55:00 GMT-0300').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.showCountdown = false;
        return;
      }

      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
}
