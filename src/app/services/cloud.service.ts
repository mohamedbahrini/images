import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import { Fichier } from '../entities/file';

import { Observable } from 'rxjs/Rx';
import { Adresse } from "../shared/adresse";

@Injectable()
export class CloudService {
  ip: string = Adresse.ip;

  constructor( private http: HttpClient) {}

  public getFiles(type: string): Observable<any> {
    let parametres = new HttpParams();
    parametres = parametres.append('type', type);

    return this.http.get(this.ip + '/protected/getFiles', {params: parametres});
  }
  public deleteFiles(fichier: Fichier): Observable<any> {

    const body = [{fichierid: fichier.fichierid, filename: fichier.filename, savedfilename: fichier.savedfilename,
      date: fichier.date, type: fichier.type, thumb: fichier.thumb}];

       return this.http.post(this.ip + '/protected/deleteFiles', body);
  }
}
