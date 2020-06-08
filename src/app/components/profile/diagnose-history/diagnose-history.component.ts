import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-diagnose-history',
  templateUrl: './diagnose-history.component.html',
  styleUrls: ['./diagnose-history.component.scss']
})
export class DiagnoseHistoryComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;

  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
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

}
