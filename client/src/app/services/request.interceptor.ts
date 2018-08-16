import {Injectable} from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {MatDialog} from "@angular/material";
import {Router} from "@angular/router";
import {Observable} from "rxjs/internal/Observable";
import {catchError, tap} from "rxjs/operators";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog,
              private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor: --- ', req.url, req.body, req.method);
    let headers = {};
    if (localStorage.getItem('token') !== null) {
      if (localStorage.getItem('token') !== undefined) {
        headers = {Authorization: localStorage.getItem('token')};
      }
    }
    const cloneRequest =  req.clone({ setHeaders: headers});
    return next.handle(cloneRequest)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (event.status === 401 || event.status === 498) {
              this.router.navigate(['/']);
            }
          }
        }));
  }
}
