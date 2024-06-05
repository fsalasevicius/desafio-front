import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth-service';
import { UserService } from 'src/app/services/user.service';

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
  constructor(private fb: FormBuilder, private _userService:UserService, private _authService:AuthService, private _router: Router,private toastr: ToastrService) { }


  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this._userService.login_user(email, password).subscribe(response => {
        if(response.data != undefined){
          this._authService.login(response.token, response.data.username);
          console.log(response);
          this.updateButtonText();
          this._router.navigate(['/']);
        }else{
          this.errorMessage = 'Las Credenciales no coinciden';
          this.toastr.success('Mensaje de éxito', 'Título');
this.toastr.error('Mensaje de error', 'Título');
this.toastr.warning('Mensaje de advertencia', 'Título');
this.toastr.info('Mensaje informativo', 'Título');
        }
      });
    }
  }
  

  updateButtonText(): void {
    const token = this._authService.getToken();
    const currentRoute = this._router.url;

    if (token) {
      this.userName = this._authService.getUserName();
      this.buttonText = this.userName !== null ? this.userName.toString() : 'Usuario';
    } else {
      if (currentRoute.includes('sign-in')) {
        this.buttonText = 'Registrarse';
      } else if (currentRoute.includes('sign-up')) {
        this.buttonText = 'Ingresar';
      } else {
        this.buttonText = 'Ingresar';
      }
    }
    console.log(this.buttonText, this.userName)
  }

}
