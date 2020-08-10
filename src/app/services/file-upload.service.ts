import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Adresse } from "../shared/adresse";

@Injectable()
export class FileUploadService {
    ipAddress: string = Adresse.ip;
    constructor(private http: HttpClient) {}

    pushFileToStorage(file: File, place: string, newName: string): Observable<HttpEvent<{}>> {
        let formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('place', place);
        formData.append('newName', newName);

        const req = new HttpRequest('POST', this.ipAddress + '/post', formData, {
            reportProgress: true,
            responseType: 'text'
        });
        return this.http.request(req);
    }

    getFilePath(filename: string, path: string): Observable<any>  {
        let parametres = new HttpParams();
        parametres = parametres.append('path', path);
        return this.http.get(this.ipAddress + '/files/' + filename,{params: parametres});
    }

    getFiles(): Observable<any> {
        return this.http.get( this.ipAddress + '/getallfiles');
    }
}