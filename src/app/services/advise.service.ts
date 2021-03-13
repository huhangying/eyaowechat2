import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { ArticlePage, ArticleSearch } from '../models/article.model';
import { Advise } from '../models/survey/advise.model';

@Injectable({
  providedIn: 'root'
})
export class AdviseService {

  constructor(
    private api: ApiService,
  ) { }

  // Advises
  geAdvise(adviseId: string) {
    return this.api.get<Advise>(`advise/${adviseId}`);
  }

  geUserAdviseHistory(userId: string) {
    return this.api.get<Advise[]>(`advises/user-history/${userId}`);
  }

  updateAdvise(data: Advise) {
    return this.api.patch<Advise>('advise/' + data._id, data);
  }
}
