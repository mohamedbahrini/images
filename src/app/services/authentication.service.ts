import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Adresse } from "../shared/adresse";


@Injectable()
export class AuthenticationService {
    ip: string = Adresse.ip;
    token: string;
    constructor(private http: HttpClient) { }

    public login(username: string, password: string): Promise<any> {
        localStorage.removeItem('currentUser');
        const body = { username: username, password: password };
        const promise = new Promise(
            (resolve, reject) => {
                this.http.post(this.ip + '/auth', body).subscribe(
                    data => {
                        this.token = data['token'];
                        if (this.token) {
                            localStorage.setItem('currentUser', JSON.stringify({
                                username: username, token: this.token, time: new Date()
                            }));
                        }
                        resolve();
                    },
                    (err: HttpErrorResponse) => { reject();}
                );
            }
        );
        return promise;
    }

    public logout() {
        localStorage.removeItem('currentUser');
    }

    public isAuthenticated(): boolean {
        const expiration: number = 604800 * 1000;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const time = currentUser && currentUser.time;
        const token = currentUser && currentUser.token;
        const now = new Date();
        const creation = new Date(time);
        const difference = Math.abs(now.getTime() - creation.getTime());
        if (difference < expiration) {
            return true;
        } else {
            return false;
        }
    }

    public getUserName(): string {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const username = currentUser && currentUser.username;
        return username;
    }
}
