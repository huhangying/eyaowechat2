import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { Doctor } from 'src/app/models/doctor.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-adverse-reaction',
  templateUrl: './adverse-reaction.component.html',
  styleUrls: ['./adverse-reaction.component.scss']
})
export class AdverseReactionComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  doctor: Doctor;
  user: User;

  constructor(
    private core: CoreService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.doctor = this.router.getCurrentNavigation().extras.state?.doctor || {};
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  ngOnInit(): void {
    this.core.setTitle('不良反应反馈');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

}
