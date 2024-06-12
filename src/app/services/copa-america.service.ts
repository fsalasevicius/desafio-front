import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CopaAmericaService {

  public url;

  constructor(
    private _http : HttpClient,
  ) {
    this.url = GLOBAL.url;
  }

  stadium_list():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'stadium_list/',{headers:headers});
  }

  country_list():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'country_list/',{headers:headers});
  }

  match_list():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'match_list/',{headers:headers});
  }

  register_prediction(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url + "register_prediction",data,{headers})
  }

  view_prediction(user:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url + "view_prediction",user,{headers})
  }

  table_prediction(user:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url + "table_prediction",user,{headers})
  }

  table_resultados():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + "table_resultados",{headers})
  }

  createTournament(tournamentData: any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url + "createTournament",tournamentData,{headers})
  }

  joinTournament(userEmail: any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url + "joinTournament",userEmail,{headers})
  }

  sendInvitationEmail(invitationData: any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url + "/send-invitation",invitationData,{headers})
  }

  getUserInvitations(userEmail: any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url + "getUserInvitations",userEmail,{headers})
  }

}
