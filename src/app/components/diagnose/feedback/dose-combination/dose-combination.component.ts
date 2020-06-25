import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor.model';
import { User } from 'src/app/models/user.model';
import { Subject } from 'rxjs';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dose-combination',
  templateUrl: './dose-combination.component.html',
  styleUrls: ['./dose-combination.component.scss']
})
export class DoseCombinationComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  doctor: Doctor;
  user: User;

  constructor(
    private core: CoreService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        this.doctor = data.doctor;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.core.setTitle('联合用药反馈');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  back() {
    this.router.navigate(['/current-diagnose'], { queryParams: this.route.snapshot.queryParams });
  }

}
