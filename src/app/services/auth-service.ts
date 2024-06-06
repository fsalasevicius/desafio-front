import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(token: string | undefined, email: string | undefined): boolean {
    if (token && email) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userName', email.split('@')[0]);
      return true;
    } else {
      console.error('Token o nombre de usuario indefinidos');
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getEmail(): string | null {
    return localStorage.getItem('userName');
  }

}