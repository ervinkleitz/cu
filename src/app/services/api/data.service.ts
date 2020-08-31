import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_ENDPONT = `https://swapi.py4e.com/api/people`;

  constructor(private httpClient: HttpClient) { }

  public getData(): any {
    return this.httpClient.get(this.REST_API_ENDPONT);
  }
}
