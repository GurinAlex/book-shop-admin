import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {Book, User} from '../interfaces';
import {BehaviorSubject, Observable} from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token');
  }

  login(user: User): Observable<HttpResponse<any>> {
    return this.http.post(`${environment.api_server}/signin`, user, { observe: 'response' } )
      .pipe(
        tap(this.setToken)
      );
  }

  logout(): void {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(response: HttpResponse<any> | null): void {
    if (response) {
      localStorage.setItem('token', response.headers.get('authorization'));
    } else {
      localStorage.clear();
    }
  }
}
