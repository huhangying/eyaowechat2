import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { Observable, of } from 'rxjs';
import { MessageService } from 'src/app/core/services/message.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.scss']
})
export class DoctorDetailsComponent implements OnInit {
  doctor: Doctor;
  userid: string;
  relationshipExisted$: Observable<boolean>;

  constructor(
    private router: Router,
    private core: CoreService,
    private doctorService: DoctorService,
    private message: MessageService,
  ) {
    this.doctor = this.router.getCurrentNavigation().extras.state?.doctor || {};
    this.userid = this.router.getCurrentNavigation().extras.state?.userid;
    if (this.doctor?._id && this.userid) {
      this.relationshipExisted$ = this.doctorService.checkRelationshipExisted(this.doctor._id, this.userid);
    }
  }

  ngOnInit(): void {
    this.core.setTitle('医生首页');
  }

  addFocus() {
    this.doctorService.addRelationship(this.doctor._id, this.userid).pipe(
      tap(result => {
        if (result) {
          this.relationshipExisted$ = of(true);
          this.message.success('关注成功！');
        } else {
          this.message.error();
        }
      }),
    ).subscribe();
  }

  removeFocus() {
    this.message.confirm('取消关注将断开您与该药师的联系。您确定?', (result) => {
      if (!result) return;
      this.doctorService.removeRelationship(this.doctor._id, this.userid).pipe(
        tap(result => {
          if (result) {
            this.relationshipExisted$ = of(false)
          } else {
            this.message.error();
          }
        }),
      ).subscribe();
    });
  }

}
