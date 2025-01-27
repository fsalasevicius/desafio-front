import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'primeng/api';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-user-segurity-form',
  templateUrl: './user-segurity-form.component.html',
  styleUrls: ['./user-segurity-form.component.scss'],
})
export class UserSegurityFormComponent implements OnInit {
  public token = localStorage.getItem('authToken');
  public user: any = {};
  public passwordForm: FormGroup;
  public submitted = false;
  public formChanged = false;
  public passwordsMatchError = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private _userService: UserService,
    private _messageService: MessageService,
    private _fb: FormBuilder
  ) {
    this.passwordForm = this._fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required], 
    }, { validators: this.matchPasswords('newPassword') }); 
  }

  ngOnInit(): void {
    this.passwordForm.valueChanges.subscribe(() => {
      this.formChanged = true;
    });
    if (this.token) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }

    this.submitted = false;
  }

  togglePasswordVisibility(field: string): void {
    switch (field) {
      case 'currentPassword':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'newPassword':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirmPassword':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  matchPasswords(password: string) {
    return (control: AbstractControl) => {
      const formGroup = control.parent as FormGroup;
      if (formGroup) {
        const passwordControl = formGroup.controls[password];
        if (control.value !== passwordControl.value) {
          return { mismatch: true };
        }
      }
      return null;
    };
  }

  onSubmit(): void {
    this.submitted = true;
    this.markAllAsTouched();

    if (!this.token) {
      console.error('No hay token disponible. No se pueden guardar los cambios.');
      return;
    }

    if (this.passwordForm.valid) {
      const formValue = this.passwordForm.value;
      if (formValue.newPassword === formValue.currentPassword) {
        this.passwordsMatchError = true;
        return;
      }

      const updatedUser = {
        currentPassword: formValue.currentPassword,
        newPassword: formValue.newPassword,
      };

      this._userService.update_password(updatedUser, this.token).subscribe(
        (response) => {
          localStorage.setItem('userData', JSON.stringify(response.data));
          localStorage.setItem('authToken', response.token);
          this._messageService.add({
            severity: 'success',
            summary: 'Proceso Exitoso',
            detail: 'La contraseña se ha actualizado correctamente.',
          });
        },
        (error) => {
          console.error('Error al actualizar la contraseña:', error);
          let errorMessage = 'Ha ocurrido un problema al actualizar la contraseña.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
          });
        }
      );
    }
  }

  isFieldInvalid(field: string): string {
    const control = this.passwordForm.get(field);
    return control && control.invalid && (control.dirty || control.touched || this.submitted) ? 'input-error' : 'input-valid';
  }

  markAllAsTouched(): void {
    Object.values(this.passwordForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.passwordForm.get(controlName);

    if (!control) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Este campo es requerido.';
    }

    if (control.hasError('minlength')) {
      const minLengthError = control.errors?.['minlength']; 
      return `La contraseña debe tener al menos ${minLengthError?.requiredLength} caracteres.`;
    }

    if (control.hasError('pattern')) {
      return 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula y un número.';
    }

    return '';
  }
}