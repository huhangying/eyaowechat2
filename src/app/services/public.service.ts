import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Faq, WxMaterial } from '../models/public.model';

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

  getMaterialCount(hid: number) {
    return this.api.get<{ news_count: number }>('wechat/material-count/auth/' + hid);
  }

  getWxMaterialList(hid: number, page = 0) {
    return this.api.get<WxMaterial>(`wechat/material-list/auth/${hid}/${page}`);
  }
}
