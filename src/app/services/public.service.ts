import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Faq } from '../models/public.model';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(
    private api: ApiService,
  ) { }

  getFaqs(hid: number): Observable<Faq[]> {
    return this.api.get<Faq[]>('faqs/wechat/auth/' + hid);
  }
}
