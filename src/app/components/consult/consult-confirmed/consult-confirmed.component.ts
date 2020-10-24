import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Consult } from 'src/app/models/consult/consult.model';
import { Doctor } from 'src/app/models/doctor.model';
import { User } from 'src/app/models/user.model';
import { ConsultService } from 'src/app/services/consult.service';

@Component({
  selector: 'app-consult-confirmed',
  templateUrl: './consult-confirmed.component.html',
  styleUrls: ['./consult-confirmed.component.scss']
})
export class ConsultConfirmedComponent implements OnInit {
  type: number;
  consultId: string;
  consult: Consult;
  doctor: Doctor;
  // user: User;

  constructor(
    private route: ActivatedRoute,
    private consultService: ConsultService,
  ) {
    this.route.queryParams.pipe(
      tap(params => {
        this.type = +params.type;
        this.consultId = params.id;
      })
    ).subscribe();

    this.route.data.pipe(
      tap(data => {
        // this.user = data.user;
        this.doctor = data.doctor;

          this.consultService.getConsultById(this.consultId).pipe(
          tap(result => {
            this.consult = result;
          })
        ).subscribe();
      }),
    ).subscribe();
  }

  ngOnInit(): void {
  }

  typeName() {
    return this.type !== 1 ? '图文咨询' : '电话咨询';
  }

  back() {

  }

}
