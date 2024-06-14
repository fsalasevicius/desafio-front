import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sign-in-area',
  templateUrl: './sign-in-area.component.html',
  styleUrls: ['./sign-in-area.component.scss']
})
export class SignInAreaComponent implements OnInit {
  public buttonText: string = 'Ingresar';
  public userName: string | null = null;
  public errorMessage: string | null = null;
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private _userService: UserService, private _authService: AuthService, private _router: Router, private _messageService: MessageService) { }


  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  showSuccess() {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this._userService.login_user(email, password).subscribe(response => {
        if (response.data != undefined) {
          this._authService.login(response.token, response.data.email, response.data);
          this.updateButtonText(); 
          this._messageService.add({ severity: 'success', summary: 'Credenciales Correctas', detail: 'Ingresando...' });
          setTimeout(() => {
            this._router.navigate(['/']);
          }, 1000);
        } else {
          this._messageService.add({ severity: 'error', summary: 'Credenciales Incorrectas', detail: 'Revise los datos ingresados.' });
        }
      });
    }
  }


  updateButtonText(): void {
    const token = this._authService.getToken();
    const currentRoute = this._router.url;
  
    if (token) {
      const userName = this._authService.getEmail();
      this.userName = userName !== null ? userName.toString() : 'Usuario';
    }
  
    if (currentRoute.includes('sign-in')) {
      this.buttonText = 'Registrarse';
    } else if (currentRoute.includes('sign-up')) {
      this.buttonText = 'Ingresar';
    } else {
      this.buttonText = token ? (this.userName ? this.userName.toString() : 'Usuario') : 'Ingresar';
    }
  }

}
