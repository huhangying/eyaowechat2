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


  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    public dialog: MatDialog,
    private diagnoseService: DiagnoseService,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        if (this.user?._id) {
          this.diagnoses$ = this.diagnoseService.getUserDiagnoseHistory(this.user._id);
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

  goDetails(diagnose: Diagnose) {
    this.dialog.open(DiagnoseDetailsComponent, {
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: {
        diagnose: diagnose,
        mode: 3
      }
    }).afterClosed().subscribe(() => {
      this.core.setTitle('门诊历史记录');
    });
  }

}