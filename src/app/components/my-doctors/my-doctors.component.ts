import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { Observable, Subject } from 'rxjs';
import { Doctor } from 'src/app/models/doctor.model';
import { tap, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my-doctors',
  templateUrl: './my-doctors.component.html',
  styleUrls: ['./my-doctors.component.scss']
})
export class MyDoctorsComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;
  doctors$: Observable<Doctor[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private core: CoreService,
    private doctorService: DoctorService,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        if (this.user) {
          this.doctors$ = this.doctorService.getDoctorsByUser(this.user._id);
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.core.setTitle('我的药师团队');

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  addDoctor() {
    this.router.navigate(['/add-doctor'], { queryParams: this.route.snapshot.queryParams });
  }

}
