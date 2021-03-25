import {Injectable} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';


import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
export class DownloadService {

    fileDownloadUrl = 'https://wwwdev.ebi.ac.uk/pdbe/download/pdb/entry/';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type':  'application/json' }),
        responseType: 'json' as 'json'
    };

    httpBlobOptions = {
      headers: new HttpHeaders({ 'Content-Type':  'application/json' }),
      responseType: 'blob' as 'json'
  };

    constructor(private http: HttpClient) {
    }

    postFileDownloadServer(fdsType, fdsConfig): Observable<any> {
      return this.http.post<any>(`${this.fileDownloadUrl}${fdsType}`, fdsConfig, this.httpOptions)
      .pipe(
          tap(
            data => {
              return data;
            }
          ),
          catchError(this.handleError())
        );
    }

    getFileDownloadServer(hashedurl) : Observable<any>{
      return this.http.get<any>(hashedurl, {observe: 'response', responseType: 'blob' as 'json'})
      .pipe(
        tap(
          data => {
            return data;
          }
        ),
        catchError(this.handleError())
      );
    }

    private handleError() {
        return (error: Response): Observable<any> => {
          const errMsg =  `Error: ${error.status}, ${error.statusText}`;
          return throwError(errMsg);
        };
      }

}
