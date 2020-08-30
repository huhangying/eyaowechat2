import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CoreService } from 'src/app/core/services/core.service';
import { DiagnoseService } from 'src/app/services/diagnose.service';
import { Diagnose } from 'src/app/models/diagnose.model';
import { MessageService } from 'src/app/core/services/message.service';
import { MatDialog } from '@angular/material/dialog';
import { TodayNoticeComponent } from '../../diagnose/today-notice/today-notice.component';

@Component({
  selector: 'app-diagnose-notice',
  templateUrl: './diagnose-notice.component.html',
  styleUrls: ['./diagnose-notice.component.scss']
})
export class DiagnoseNoticeComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  loaded = false;

  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    public dialog: MatDialog,
    private diagnoseService: DiagnoseService,
    private message: MessageService,
  ) {
    this.route.data.pipe(
      tap(async data => {
        const { id } = this.route.snapshot.queryParams;
        if (id) {
          const diagnose = await this.diagnoseService.getDiagnoseById(id).toPromise();
          this.loaded = true;
          if (!diagnose?._id) {
            this.message.error('门诊提醒信息加载失败');
            return;
          }

          this.dialog.open(TodayNoticeComponent, {
            maxWidth: '100vw',
            panelClass: 'full-width-dialog',
            data: {
              diagnose: diagnose,
              noticeOnly: true
            }
          });
        } else {
          this.loaded = true;
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.core.setTitle('门诊提醒');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

}
