import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { User } from '../entities/user';

import { Observable } from 'rxjs/Rx';
import { Adresse } from '../shared/adresse';

@Injectable()
export class UserService {
  ip: string = Adresse.ip;

  constructor(private http: HttpClient) { }

  public getInfo(): Observable<any> {
    return this.http.get(this.ip + '/protected/getInfos');
  }

  public getFavorits(): Observable<any> {
    return this.http.get(this.ip + '/protected/getFavorits');
  }

  public addFavorite(username: string): Observable<any> {
    let parametres = new HttpParams();
    parametres = parametres.append('username', username);
    console.log('addin ' + username);
    return this.http.get(this.ip + '/protected/addFavorite', { params: parametres });
  }

  public deleteFavorite(username: string): Observable<any> {
    let parametres = new HttpParams();
    parametres = parametres.append('username', username);
    return this.http.get(this.ip + '/protected/deleteFavorite', { params: parametres });
  }

  public subscribtion(user: User): Observable<any> {
     return this.http.post(this.ip + '/addUser', user);
  }

  public updateUser(user: User) {
    console.log(user);
    const body = {
      username: user.username, phone: user.phone, email: user.email,
      country: user.country, postalCode: user.postalCode, city: user.city, adresse1: user.adresse1,
      adresse2: user.adresse2, speciality: user.speciality, specialityTitle: user.specialityTitle,
      affiliation: user.affiliation, position: user.position, title: user.title, lastname: user.lastname,
      firstname: user.firstname, photo: user.photo, subscriptionDate: user.subscriptionDate
    };
    return this.http.post(this.ip + '/protected/updateUser', body);
  }

  public getNumberFollowers(): Observable<any> {
    return this.http.get(this.ip + '/protected/getFollowers');
  }

  public getNumberFollowings(): Observable<any> {
    return this.http.get(this.ip + '/protected/getFollowings');
  }
}
