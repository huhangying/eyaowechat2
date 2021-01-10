import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  
  getMaterialCount() {
    return this.api.get<{news_count: number}>('wechat/material-count');
  }

  getWxMaterialList(page=0) {
    return this.api.get<WxMaterial>('wechat/material-list/' + page)
  }
}
