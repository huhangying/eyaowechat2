import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';
import { WxMaterialNewsItem } from 'src/app/models/public.model';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-hot-news',
  templateUrl: './hot-news.component.html',
  styleUrls: ['./hot-news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotNewsComponent implements OnInit {
  newsItems: WxMaterialNewsItem[];
  hid: number;
  currentPage = 0;
  currentItemCount = 0;
  totalItemCount = 0;
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
    this.core.setTitle('热门文章');
    this.hid = this.route.snapshot.queryParams?.state || '';
    this.newsItems = [];
    if (this.hid) {
      this.loadMore();
    }
  }

  loadMore() {
    this.loading = true;
    this.publicService.getWxMaterialList(+this.hid, this.currentPage).pipe(
      // delay(2000),
      tap((result) => {
        this.loading = false;
        if (!result) { return; }
        if (this.currentPage === 0) {
          this.totalItemCount = result.total_count;
        }
        const itemCount = result.item_count;
        this.currentItemCount += itemCount;
        // WxMaterial -> WxMaterialItem
        if (itemCount > 0 && result.item) {
          result.item.map(materialItem => {
            // WxMaterialItem -> WxMaterialNewsItem
            materialItem.content?.news_item?.map(newsItem => {
              this.newsItems.push(newsItem);
            })
          });
          this.currentPage++;
          this.cd.markForCheck();
        }
      }),
      catchError(err => {
        this.loading = false;
        return EMPTY;
      })
    ).subscribe();
  }

  viewNewsItem(news: WxMaterialNewsItem) {

  }

}
