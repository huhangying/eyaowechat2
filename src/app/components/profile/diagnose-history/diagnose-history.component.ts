import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { Subject, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { DiagnoseService } from 'src/app/services/diagnose.service';
import { Diagnose } from 'src/app/models/diagnose.model';
import { MatDialog } from '@angular/material/dialog';
import { DiagnoseDetailsComponent } from '../../diagnose/diagnose-details/diagnose-details.component';

@Component({
  selector: 'app-diagnose-history',
  templateUrl: './diagnose-history.component.html',
  styleUrls: ['./diagnose-history.component.scss']
})
export class DiagnoseHistoryComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;
  diagnoses$: Observable<Diagnose[]>;
  historyLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    public dialog: MatDialog,
    private diagnoseService: DiagnoseService,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(async data => {
        this.user = data.user;
        const {id} = this.route.snapshot.queryParams;
        if (id) { // diagnose id
          const diagnose = await this.diagnoseService.getDiagnoseById(id).toPromise();
          if (diagnose?._id) {
            this.goDetails(diagnose, 1); // 只显示门诊结论
            return;
          }
        }
        if (this.user?._id) {
          this.loadDiagnose(this.user._id);
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.core.setTitle('门诊历史记录');
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  loadDiagnose(userid: string) {
    if (userid) {
      this.diagnoses$ = this.diagnoseService.getUserDiagnoseHistory(userid);
      this.historyLoaded = true;
    }
  }

  goDetails(diagnose: Diagnose, mode: number) {
    this.dialog.open(DiagnoseDetailsComponent, {
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: {
        diagnose: diagnose,
        mode: mode
      }
    }).afterClosed().subscribe(() => {
      this.core.setTitle('门诊历史记录');
      if (!this.historyLoaded && this.user?._id) {
        this.loadDiagnose(this.user._id);
      }
    });
  }

}
