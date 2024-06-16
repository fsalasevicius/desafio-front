import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public url;

  constructor(
    private _http : HttpClient,
  ) {
    this.url = GLOBAL.url;
  }

  register_user(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url + "register_user",data,{headers})
  }

  login_user(email: string, password: string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url + "login_user",{ email, password },{headers})
  }

  update_user(user: any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url + "update_user",user,{headers})
  }

  update_password(user: any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url + "update_password",user,{headers})
  }

}
