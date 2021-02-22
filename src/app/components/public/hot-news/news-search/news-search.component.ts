import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';
import { ArticleSearch } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-news-search',
  templateUrl: './news-search.component.html',
  styleUrls: ['./news-search.component.scss']
})
export class NewsSearchComponent implements OnInit {
  keyword: string;
  hid: string;
  articleList: ArticleSearch[];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    private articleService: ArticleService,
  ) { 
    this.keyword = route.snapshot.queryParams.k; // keyword
    this.hid = route.snapshot.queryParams.h; // hid
  }

  ngOnInit(): void {
    this.core.setTitle('公众号文章搜索结果');
    
    if (this.keyword) {
      this.search();
    }
  }

  search() {
    this.loading = true;
    this.articleService.getArticleListByKeyword(this.keyword, this.hid).pipe(
      tap(results => {
        this.articleList = results;
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe();
  }
  
  navToArticle(targetUrl: string) {
    window.open(targetUrl, '_blank');
  }
}
