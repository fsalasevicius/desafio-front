import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(token: string | undefined, userName: string | undefined): void {
    if (token && userName) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userName', userName);
    } else {
      console.error('Token o nombre de usuario indefinidos');
    }
  }
  
  logout(): void {
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserName(): string | null {
    // Supón que el nombre de usuario está almacenado en localStorage cuando el usuario inicia sesión
    return localStorage.getItem('userName');
  }

}
