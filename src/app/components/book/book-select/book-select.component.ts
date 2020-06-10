import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Doctor } from 'src/app/models/doctor.model';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-book-select',
  templateUrl: './book-select.component.html',
  styleUrls: ['./book-select.component.scss']
})
export class BookSelectComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;
  doctors$: Observable<Doctor[]>;

  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    private doctorService: DoctorService,
  ) { 
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        if (this.user) {
          this.doctors$ = this.doctorService.getScheduleDoctorsByUser(this.user._id);
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.core.setTitle('预约门诊');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

}
