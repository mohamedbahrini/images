import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Message } from '../entities/message';
import { Observable } from 'rxjs/Rx';
import { Adresse } from '../shared/adresse';

@Injectable()
export class MessageService {
  ip: string = Adresse.ip;
  constructor(private httpClient: HttpClient) { }

  getMessages(receiver: string, type: string) {
    let parametres = new HttpParams();
    parametres = parametres.append('contact', receiver);
    parametres = parametres.append('type', type);
    return this.httpClient.get(this.ip + '/protected/getMessages', { params: parametres });
  }

  getMessagesAsync(receiver: string, type: string): Observable<any> {
    let parametres = new HttpParams();
    parametres = parametres.append('contact', receiver);
    parametres = parametres.append('type', type);

     return this.httpClient.get(this.ip + '/protected/getMessages', { params: parametres });
  }

  getUsers(): Observable<any> {
    return this.httpClient.get(this.ip + '/protected/getUsers');
  }

  saveMessage(message: Message, receiver: string) {
    const body: Message [] = [message];
    let parametres = new HttpParams();
    parametres = parametres.append('receivers', receiver);
    parametres = parametres.append('messages', JSON.stringify(body));
    return this.httpClient.get(this.ip + '/protected/saveMessages', { params: parametres });
  }
}
