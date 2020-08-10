import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Comment } from '../entities/comment';
import { Observable } from 'rxjs/Rx';
import { Adresse } from "../shared/adresse";

@Injectable()
export class CommentService {
    ip: string = Adresse.ip;
    
    constructor(private http: HttpClient) { }

    public addComment(comment: Comment, posteId: string): Observable<any> {
        console.log('$$ '+posteId);
        const body = JSON.stringify(comment);
        let parametres = new HttpParams();
        parametres = parametres.append('comment', body);
        parametres = parametres.append('posteId', posteId);

        return this.http.get(this.ip + '/protected/addComment', { params: parametres });
    }
}
