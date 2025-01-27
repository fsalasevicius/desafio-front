import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

function ageValidator(control: AbstractControl): { [key: string]: any } | null {
  const birthday = new Date(control.value);
  const ageDiff = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDiff);
  const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);

  return calculatedAge >= 10 ? null : { 'invalidAge': true };
}

@Component({
  selector: 'app-user-data-form',
  templateUrl: './user-data-form.component.html',
  styleUrls: ['./user-data-form.component.scss'],
})
export class UserDataFormComponent implements OnInit {
  public token = localStorage.getItem('authToken');
  public user: any = {};
  public formattedCreatedAt: string | undefined;
  public userDataForm: FormGroup | undefined;
  public registerForm!: FormGroup;
  public formChanged = false;

  constructor(private _userService: UserService, private _router: Router, private _messageService: MessageService, private _fb: FormBuilder) {
    if (this.token) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        this.user = JSON.parse(userData);
        this.formattedCreatedAt = this.formatDate(this.user.createdAt);
      }
    }
  }

  ngOnInit(): void {
    this.registerForm = this._fb.group({
      name: [this.user.name || '', Validators.required],
      surname: [this.user.surname || '', Validators.required],
      birthday: [this.user.birthday || '', [
        Validators.required,
        (control: AbstractControl) => {
          if (!control.value) {
            return null; 
          }
          const date = new Date(control.value);
          return isNaN(date.getTime()) ? { 'invalidDate': true } : null;
        },
        ageValidator
      ]],
      email: [{ value: this.user.email || '', disabled: true }, [Validators.required, Validators.email]],
      description: [this.user.description || ''] 
    });

    this.registerForm.valueChanges.subscribe(() => {
      this.formChanged = true;
    });
  }

  onSubmit(): void {
    if (!this.token) {
      console.error('No hay token disponible. No se pueden guardar los cambios.');
      return;
    }

    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          const errorMessage = this.getErrorMessage(control);
          console.error(`Error en el campo ${key}: ${errorMessage}`);
        }
      });
      this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, corrija los errores en el formulario.' });
      return;
    }

    const updatedUser = {
      ...this.user,
      ...this.registerForm.value,
      email: this.user.email,
      createdAt: this.user.createdAt,
      rol: this.user.rol
    };

    this._userService.update_user(updatedUser, this.token).subscribe(
      (response) => {
        localStorage.setItem('userData', JSON.stringify(response.data));
        localStorage.setItem('authToken', response.token);
        this._messageService.add({ severity: 'success', summary: 'Proceso Exitoso', detail: 'Los datos se han actualizado correctamente.' });
      },
      (error) => {
        console.error('Error al actualizar los datos:', error);
        this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un problema al actualizar los datos.' });
      }
    );
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'Este campo es obligatorio.';
    } else if (control.hasError('email')) {
      return 'Correo electrónico no válido.';
    } else if (control.hasError('invalidAge')) {
      return 'Debe tener al menos 10 años.';
    } else if (control.hasError('invalidDate')) {
      return 'Fecha no válida.';
    } else {
      return '';
    }
  }

  formatDate(date: string): string {
    return formatDate(date, 'dd/MM/yyyy HH:mm', 'en-US');
  }
}