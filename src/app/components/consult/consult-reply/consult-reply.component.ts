import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Consult } from 'src/app/models/consult/consult.model';
import { Doctor } from 'src/app/models/doctor.model';
import { User } from 'src/app/models/user.model';
import { ConsultService } from 'src/app/services/consult.service';

@Component({
  selector: 'app-consult-reply',
  templateUrl: './consult-reply.component.html',
  styleUrls: ['./consult-reply.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultReplyComponent implements OnInit {
  consults: Consult[];
  consultId: string;
  doctor: Doctor;
  user: User;

  constructor(
    private route: ActivatedRoute,
    private consultService: ConsultService,
    private cd: ChangeDetectorRef,
  ) {
    this.route.queryParams.pipe(
      tap(params => {
        this.consultId = params.id;
      })
    ).subscribe();

    this.route.data.pipe(
      tap(data => {
        this.user = data.user;
        this.doctor = data.doctor;

        this.consultService.getAllConsultsByDoctorIdAndUserId(this.doctor._id, this.user._id).pipe(
          tap(results => {
            this.consults = results;
            this.scrollTo(this.consultId);
          })
        ).subscribe();
      }),
    ).subscribe();
  }

  ngOnInit(): void {
  }

  scrollTo(consultid: string) {
    this.cd.markForCheck();
    setTimeout(() => {
      document.getElementById(consultid)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      this.cd.markForCheck();
    }, 200);
  }

  back() {

  }

}
