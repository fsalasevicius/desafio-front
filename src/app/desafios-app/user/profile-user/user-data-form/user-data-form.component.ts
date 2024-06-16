import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private _userService: UserService, private _router: Router, private _messageService: MessageService,
    private _fb: FormBuilder) {
    if (this.token) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        this.user = JSON.parse(userData);
        this.formattedCreatedAt = this.formatDate(this.user.createdAt);
      }
    }
  }

  ngOnInit(): void {
    console.log(this.user);
  }

  onSubmit(): void {
    if (!this.token) {
      console.error('No hay token disponible. No se pueden guardar los cambios.');
      return;
    }

    const updatedUser = { ...this.user };
    updatedUser.createdAt = this.user.createdAt;
    updatedUser.email = this.user.email;
    updatedUser.rol = this.user.rol;

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

  formatDate(date: string): string {
    return formatDate(date, 'dd/MM/yyyy HH:mm', 'en-US');
  }
}