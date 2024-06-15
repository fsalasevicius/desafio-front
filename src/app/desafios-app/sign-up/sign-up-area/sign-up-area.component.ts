import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';


function passwordMatchValidator(control: FormGroup): { [key: string]: any } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { 'passwordMismatch': true };
  }

  return null;
}

function ageValidator(control: AbstractControl): { [key: string]: any } | null {
  const birthday = new Date(control.value);
  const ageDiff = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDiff);
  const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);

  return calculatedAge >= 10 ? null : { 'invalidAge': true };
}


@Component({
  selector: 'app-sign-up-area',
  templateUrl: './sign-up-area.component.html',
  styleUrls: ['./sign-up-area.component.scss']
})
export class SignUpAreaComponent implements OnInit {
  passwordsMatch = true;
  public formValid: boolean = false;
  age = true;
  registerForm!: FormGroup;
  constructor(private fb: FormBuilder, private _messageService: MessageService, private _userService:UserService, private _router: Router) { }

  get birthdayControl(): AbstractControl | null {
    return this.registerForm.get('birthday');
  }
  
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      birthday: ['', [Validators.required, ageValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  
    this.registerForm.valueChanges.subscribe(() => {
      this.passwordsMatch = this.registerForm.hasError('passwordMismatch') ? false : true;
      this.age = this.registerForm.hasError('age') ? false : true;
    });
    this.registerForm.valueChanges.subscribe(() => {
      this.formValid = this.registerForm.valid;
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm)
      const user = this.registerForm.value;
      this._userService.register_user(user).subscribe(
        response => {
          if(response.data != undefined){
            this._messageService.add({ severity: 'success', summary: 'Validación Exitosa', detail: 'Creando Usuario...' });
            setTimeout(() => {
              this._router.navigate(['/']);
            }, 1000);
          }else{
            this._messageService.add({ severity: 'error', summary: 'Error al crear el usuario', detail: response.mensaje });
          }
        },
        error=> {
            this._messageService.add({ severity: 'error', summary: 'Error al crear el usuario', detail: error });
        }
      )
    } else {
      if(!this.passwordsMatch){
        this._messageService.add({ severity: 'error', summary: 'Las Contraseñas no coinciden', detail: 'La contraseña y la confirmación deben ser iguales.' });
      }else if(this.age){
        this._messageService.add({ severity: 'error', summary: 'Revise su edad.', detail: 'El usuario debe tener mas de 10 años' });
      }else{
        this._messageService.add({ severity: 'error', summary: 'Error en la carga de Datos', detail: 'Revise y complete los campos obligatorios.' });
      }
    }
  }
}