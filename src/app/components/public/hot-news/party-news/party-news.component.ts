import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';
import { WxMaterialNewsItem } from 'src/app/models/public.model';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-party-news',
  templateUrl: './party-news.component.html',
  styleUrls: ['./party-news.component.scss']
})
export class PartyNewsComponent implements OnInit {
  newsItems: WxMaterialNewsItem[];
  hid: number;
  loading: boolean;

  // @ViewChild('scroller') scroller: CdkVirtualScrollViewport;

  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    private publicService: PublicService,
    private cd: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    this.core.setTitle('党建园地');
    this.hid = this.route.snapshot.queryParams?.state || '';
    this.newsItems = [];
    if (this.hid) {
      this.loadMore();
    }
  }

  loadMore() {
    this.loading = true;
    this.publicService.searchWxArticles(+this.hid, '党建').pipe(
      // delay(2000),
      tap((result) => {
        this.loading = false;
        if (!result) { return; }
        this.newsItems = result;
        this.cd.markForCheck();
      }),
      catchError(err => {
        this.loading = false;
        return EMPTY;
      })
    ).subscribe();
  }

}
