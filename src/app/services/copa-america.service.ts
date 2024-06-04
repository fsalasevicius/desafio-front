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

}
