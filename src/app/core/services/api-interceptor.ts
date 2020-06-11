import { AppStoreService } from '../store/app-store.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(
        private appStore: AppStoreService,
        private message: MessageService,
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.indexOf('.weixin.') > 0) { // to weixin portal
            request = request.clone({
                setHeaders: {
                    //'Content-Type': 'application/json; encoding=utf-8',
                    // 'Accept': '*/*'
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Request-Headers': 'dnt, accept-language, origin',
                }
            });
        } else {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.appStore.apiToken}`
                }
            });
        }

        // this.appStore.updateLoading(true);
        return next.handle(request).pipe(
            catchError(err => this.message.errorCatch())
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
