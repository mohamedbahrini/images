import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Post } from '../entities/post';
import { Adresse } from "../shared/adresse";

@Injectable()
export class ForumService {
  ip: string = Adresse.ip;

  constructor(private http: HttpClient) { }

  public getPosts(): Observable<any> {
    return this.http.get(this.ip + '/protected/getAllPosts');
  }

  public getFilteredPosts(sujetTitre: string, sujet: string): Observable<any> {
    let parametres = new HttpParams();
    parametres = parametres.append('sujet', sujet);
    parametres = parametres.append('sujetTitre', sujetTitre);
    return this.http.get(this.ip + '/protected/getFilteredPosts', { params: parametres });
  }

  public savePost(post: Post): Observable<any> {
    return this.http.post(this.ip + '/protected/addPost', post);
  }
}
