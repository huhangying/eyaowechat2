import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';
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
    private articleService: ArticleService,
  ) { 
    this.keyword = route.snapshot.queryParams.k; // keyword
    this.hid = route.snapshot.queryParams.h; // hid
  }

  ngOnInit(): void {
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
