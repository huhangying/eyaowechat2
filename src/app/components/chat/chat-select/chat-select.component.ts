import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Doctor } from 'src/app/models/doctor.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat-select',
  templateUrl: './chat-select.component.html',
  styleUrls: ['./chat-select.component.scss']
})
export class ChatSelectComponent implements OnInit, OnDestroy {
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
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

}
