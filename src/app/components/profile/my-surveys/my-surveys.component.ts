import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my-surveys',
  templateUrl: './my-surveys.component.html',
  styleUrls: ['./my-surveys.component.scss']
})
export class MySurveysComponent implements OnInit, OnDestroy {
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
    this.core.setTitle('我的问卷');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

}
