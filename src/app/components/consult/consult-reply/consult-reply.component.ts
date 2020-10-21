import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Consult } from 'src/app/models/consult/consult.model';
import { Doctor } from 'src/app/models/doctor.model';
import { User } from 'src/app/models/user.model';
import { ConsultService } from 'src/app/services/consult.service';

@Component({
  selector: 'app-consult-reply',
  templateUrl: './consult-reply.component.html',
  styleUrls: ['./consult-reply.component.scss']
})
export class ConsultReplyComponent implements OnInit {
  consults: Consult[];
  consult: Consult;
  doctor: Doctor;
  user: User;

  constructor(
    private route: ActivatedRoute,
    private consultService: ConsultService,
  ) {
    this.route.queryParams.pipe(
      tap(params => {
        const { id } = params;
        this.consultService.getConsultById(id).pipe(
          tap(result => {
            this.consult = result;
          })
        ).subscribe();
      })
    ).subscribe();

    this.route.data.pipe(
      tap(data => {
        this.user = data.user;
        this.doctor = data.doctor;

        this.consultService.getAllConsultsByDoctorIdAndUserId(this.doctor._id, this.user._id).pipe(
          tap(results => {
            this.consults = results;
          })
        ).subscribe();
      }),
    ).subscribe();
  }

  ngOnInit(): void {
  }

}
