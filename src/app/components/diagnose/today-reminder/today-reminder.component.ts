import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';
import { Diagnose } from 'src/app/models/diagnose.model';
import { User } from 'src/app/models/user.model';
import { DiagnoseService } from 'src/app/services/diagnose.service';

@Component({
  selector: 'app-today-reminder',
  templateUrl: './today-reminder.component.html',
  styleUrls: ['./today-reminder.component.scss']
})
export class TodayReminderComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;
  diagnose: Diagnose;

  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    private diagnoseService: DiagnoseService,
  ) { 
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        if (this.user?._id) {
          this.diagnoseService.getUserCurrentDiagnose(this.user._id).subscribe(
            result => {
              this.diagnose = result;
            }
          );
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.core.setTitle('今日用药提醒');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

}
