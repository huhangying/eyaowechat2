import { AppStoreService } from '../store/app-store.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(
        private appStore: AppStoreService,
        private router: Router,
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        request = request.clone({
            setHeaders: {
                // 'Content-Type': 'application/json; encoding=utf-8',
                // 'Accept': '*/*'
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Request-Headers': 'dnt, accept-language, origin'
            }
        });

        // this.appStore.updateLoading(true);
        return next.handle(request).pipe(
            tap(res => {
                console.log(res);
                
            })
            // catchError((error: HttpErrorResponse) => {
            //     // handle error
            //     // 403 => redirect to login
            //     if (error.status === 403 || error.status === 401) {
            //         this.router.navigate(['auth/login']);
            //     }
            //     return throwError(error);
            // }),
            //   finalize(() => {
            //     this.appStore.updateLoading(false);
            //   }),
        );
    }
}
