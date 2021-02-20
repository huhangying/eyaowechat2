import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { ArticlePage, ArticleSearch } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(
    private api: ApiService,
  ) { }

  getArticleById(id: string) {
    return this.api.get<ArticlePage>('auth/page/' + id);
  }

  getArticleListByKeyword(keyword: string, hid: string) {
    return this.api.get<ArticleSearch[]>(`auth/keywordsearchs/${hid}/${keyword}`);
  }
}
