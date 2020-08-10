import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Fichier } from '../entities/file';
import { Adresse } from "../shared/adresse";

@Injectable()
export class FileService {
    ip: string = Adresse.ip;

    constructor(private http: HttpClient) { }

    public addFile(fichier: Fichier): Observable<any> {
        console.log('fichier = '+fichier);
        console.log(fichier);
        const body = '[' + JSON.stringify(fichier) + ']';
        return this.http.post(this.ip + '/protected/saveFiles', body);
    }
}
