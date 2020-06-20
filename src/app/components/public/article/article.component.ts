import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { ArticlePage } from 'src/app/models/article.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article: ArticlePage;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
  ) {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.articleService.getArticleById(params.get('id')).pipe(
          tap(result => {
            this.article = result;
          })
        ).subscribe();
      }
    );
  }

  ngOnInit(): void {
    // let id = this.route.snapshot.paramMap.get('id');
    // this.articleService.getArticleById(id).pipe(
    //   tap(result => {
    //     this.article = result;
    //   })
    // ).subscribe()

    // this.article$ = this.route.paramMap.pipe(
    //   switchMap((params: ParamMap) =>
    //     this.articleService.getArticleById(params.get('id')))
    // );
  }

}
