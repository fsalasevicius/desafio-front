import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(token: string | undefined, email: string | undefined, userData: any): boolean {
    if (token && email && userData && userData.surname && userData.name) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userName', capitalize(userData.surname) + ', ' + capitalize(userData.name));
      localStorage.setItem('userData', JSON.stringify(userData));
      return true;
    } else {
      console.error('Token, email, or user data is undefined');
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

function capitalize(str: string): string {
  return str.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}
