
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable()
export class DataService {

  private BASE_URL = environment.api_url;

  constructor(private http: HttpClient) { }

  getRights = (): Observable<any[]> => {
    return this.http.get<any[]>(this.BASE_URL + '/rights');
  }

  getProfiles = (): Observable<any[]> => {
    return this.http.get<any[]>(this.BASE_URL + '/profiles');
  }

  getPositions = (): Observable<any[]> => {
    return this.http.get<any[]>(this.BASE_URL + '/positions');
  }

  getJudgesByName = (q: string): Observable<any[]> => {
    return this.http.get<any[]>(this.BASE_URL + '/judges?q=' + q);
  }

  getLawyersByName = (q: string): Observable<any[]> => {
    return this.http.get<any[]>(this.BASE_URL + '/lawyers?q=' + q);
  }

  getPrediction = (body: any): Observable<any> => {
    return this.http.post<any[]>(this.BASE_URL + '/predict', body);
  }

}
