import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Team } from 'src/app/interface/copa-america.interface';
import { CopaAmericaService } from 'src/app/services/copa-america.service';

@Component({
  selector: 'app-top-tres',
  templateUrl: './top-tres.component.html',
  styleUrls: ['./top-tres.component.scss']
})
export class TopTresComponent implements OnInit {
  loading = true;
  teams: Team[] = [];
  user: any = undefined;
  public token = localStorage.getItem('authToken');
  positionsForm: FormGroup;
  existingPredictions: any = null; // Variable para almacenar predicciones existentes del usuario

  constructor(
    private _fb: FormBuilder,
    private _copaService: CopaAmericaService,
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
  
    // Verificar que this.user._id esté definido
  
    // Obtener predicciones existentes del usuario
    this._copaService.view_prediction_top(this.user, this.token).subscribe(
      response => {
        if (response && response.data && response.data.length > 0) {
          this.existingPredictions = response.data[0]; // Asignar la primera predicción (asumiendo que el usuario solo tiene una)
          this.populateFormWithPredictions(); // Llenar el formulario con las predicciones existentes
        } else {
          console.log('No se encontraron predicciones para el usuario');
        }
        this.loading = false;
      },
      error => {
        console.error('Error al obtener las predicciones del usuario', error);
        this.loading = false;
      }
    );
  
    // Obtener equipos del torneo
    this._copaService.getTeamTournament().subscribe(
      teams => {
        this.teams = teams.data;
        if (this.existingPredictions) {
          // Obtener los nombres de los equipos por ID
          const firstPlaceName = this.getTeamNameById(this.existingPredictions.firstPlace);
          const secondPlaceName = this.getTeamNameById(this.existingPredictions.secondPlace);
          const thirdPlaceName = this.getTeamNameById(this.existingPredictions.thirdPlace);
      
          // Asignar los valores al formulario
          this.positionsForm.patchValue({
            firstPlace: firstPlaceName,
            secondPlace: secondPlaceName,
            thirdPlace: thirdPlaceName,
          });
        }
      },
      error => {
        console.error('Error al obtener los equipos del torneo', error);
        this.loading = false;
      }
    );
  }
  
  populateFormWithPredictions(): void {
    if (this.existingPredictions) {
      // Obtener los nombres de los equipos por ID
      const firstPlaceName = this.getTeamNameById(this.existingPredictions.firstPlace);
      const secondPlaceName = this.getTeamNameById(this.existingPredictions.secondPlace);
      const thirdPlaceName = this.getTeamNameById(this.existingPredictions.thirdPlace);
  
      // Asignar los valores al formulario
      this.positionsForm.patchValue({
        firstPlace: firstPlaceName,
        secondPlace: secondPlaceName,
        thirdPlace: thirdPlaceName,
      });
    }
  }
  getTeamNameById(id: string): string {
    const team = this.teams.find(t => t._id.toString() === id);
    return team ? team.name : '';
  }

  validateSelection(place: 'firstPlace' | 'secondPlace' | 'thirdPlace', event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value.trim();

    // Verificar si el valor seleccionado está en la lista de equipos
    const isValid = this.teams.some(team => team.name === selectedValue);

    // Si es válido, actualizar el valor en el formulario
    if (isValid) {
      this.positionsForm.patchValue({
        [place]: selectedValue
      });
    } else {
      // Si no es válido, limpiar el campo en el formulario
      this.positionsForm.patchValue({
        [place]: ''
      });
    }
  }

  savePredictions(): void {
    if (this.positionsForm.valid) {
      const predictions = { ...this.positionsForm.value };
  
      ['firstPlace', 'secondPlace', 'thirdPlace'].forEach(place => {
        const teamName = predictions[place];
  
        const selectedTeam = this.teams.find(team => team.name === teamName);
  
        if (selectedTeam) {
          predictions[place] = selectedTeam._id;
        }
      });
  
      predictions.user = this.user._id;
  
      // Verificar si ya existen predicciones
      if (this.existingPredictions) {
        // Si ya existen predicciones, actualizarlas
        this._copaService.register_prediction_top(predictions, this.token).subscribe(
          response => {
            // Aquí puedes manejar la respuesta del backend si es necesario
          },
          error => {
            console.error('Error al actualizar las predicciones del podio', error);
            // Aquí puedes manejar errores y mostrar mensajes al usuario
          }
        );
      } else {
        // Si no existen predicciones, guardar nuevas
        this._copaService.register_prediction_top(predictions, this.token).subscribe(
          response => {
            // Aquí puedes manejar la respuesta del backend si es necesario
          },
          error => {
            console.error('Error al guardar las predicciones del podio', error);
            // Aquí puedes manejar errores y mostrar mensajes al usuario
          }
        );
      }
    }
  }
  clearField(place: 'firstPlace' | 'secondPlace' | 'thirdPlace'): void {
    const formControl = this.positionsForm?.get(place);
    if (formControl) {
      formControl.reset(); // Resetear el campo específico del formulario
    } else {
      console.error(`El formulario o el campo ${place} no están inicializados correctamente.`);
    }
  }
}