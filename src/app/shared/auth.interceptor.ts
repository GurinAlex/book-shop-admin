import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {
      'Content-Type': 'application/json'
    };

    const token = this.authService.token;

    if (token) {
      headersConfig['Authorization'] = `${token}`;
    }
    const request = req.clone({setHeaders: headersConfig});

    return next.handle(request)
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/'], {
              queryParams: {
                authFailed: true
              }
            });
            return throwError(error);
          }
        })
      );
  }

  logger(response): void {
    console.log(response);
  }
}
