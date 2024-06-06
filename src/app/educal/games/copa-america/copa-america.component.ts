import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Match } from 'src/app/interface/copa-america.interface';
import { CopaAmericaService } from 'src/app/services/copa-america.service';
import { MessageService } from 'primeng/api';

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

  constructor(private fb: FormBuilder, private _copaAmericaService: CopaAmericaService, private _messageService: MessageService) {
    this.predictionForm = this.fb.group({
      predictions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this._copaAmericaService.match_list().subscribe(
      (response: any) => {
        this.matches = response.data;
        if (Array.isArray(this.matches)) {
          this.groupMatches();
          this.addMatchControls();
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
    this.initializeForm();
  }

  initializeForm() {
    this.grupos.forEach((grupo, gIndex) => {
      const groupFormArray = this.fb.array([]);
      grupo.partidos.forEach((partido, pIndex) => {
        const partidoFormGroup = this.fb.group({
          predictedScore: this.fb.group({
            teamA: ['', Validators.required],
            teamB: ['', Validators.required]
          }),
          predictedWinner: [''],
          predictedGoalDifference: ['']
        });
        groupFormArray.push(partidoFormGroup);
      });
      (this.predictionForm.get('predictions') as FormArray).push(groupFormArray);
    });
  
    // Marcar el formulario como 'touched' después de inicializarlo
    this.predictionForm.markAllAsTouched();
  }

  private addMatchControls(): void {
    const predictionsFormArray = this.predictionForm.get('predictions') as FormArray;
    this.matches.forEach(match => {
      predictionsFormArray.push(this.createMatchGroup(match));
    });
  }

  private createMatchGroup(match: Match): FormGroup {
    return this.fb.group({
      matchId: [match._id, Validators.required],
      predictedScore: this.fb.group({
        teamA: ['', Validators.required],
        teamB: ['', Validators.required]
      }),
    });
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

  getInvalidControls(form: FormGroup | FormArray): string[] {
    const invalidControls: string[] = [];
    const controls = form.controls as { [key: string]: AbstractControl };
    for (const name in controls) {
      if (controls[name] instanceof FormGroup || controls[name] instanceof FormArray) {
        const nestedInvalidControls = this.getInvalidControls(controls[name] as FormGroup | FormArray);
        invalidControls.push(...nestedInvalidControls.map(controlName => `${name}.${controlName}`));
      } else if (controls[name].invalid) {
        invalidControls.push(name);
      }
    }
    return invalidControls;
  }
  
  onSubmit(): void {
    if (this.predictionForm.invalid) {
      this.predictionForm.markAllAsTouched();
      const invalidControls = this.getInvalidControls(this.predictionForm);
      console.log('Campos inválidos:', invalidControls);
      this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Faltan realizar predicciones.' });
      return;
    } else {
      this._messageService.add({ severity: 'success', summary: 'Proceso Exitoso!', detail: 'Guardando Predicciones...' });
    }
  }

  get predictions(): FormArray {
    return this.predictionForm.get('predictions') as FormArray;
  }

  getIconClass(teamA: number, teamB: number): string {
    if (teamA > teamB) {
      return 'fas fa-check-circle'; // Icono de check si teamA tiene más goles
    } else if (teamA < teamB) {
      return 'fas fa-times-circle'; // Icono de times si teamB tiene más goles
    } else {
      return 'fas fa-equals'; // Icono de igual si los goles son iguales
    }
  }

  getFormGroupIndex(gIndex: number, pIndex: number): number {
    return gIndex * this.grupos[gIndex].partidos.length + pIndex;
  }
}