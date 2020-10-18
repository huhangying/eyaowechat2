import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { ConsultService } from 'src/app/services/consult.service';
import { Subject } from 'rxjs';
import { MessageService } from 'src/app/core/services/message.service';
import { tap, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AppStoreService } from 'src/app/core/store/app-store.service';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorDetailsComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  doctor: Doctor;
  userid: string;
  relationExisted: boolean;
  openid: string;
  state: string;
  tags: string[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private core: CoreService,
    private appStore: AppStoreService,
    private doctorService: DoctorService,
    private consultService: ConsultService,
    private message: MessageService,
    private cd: ChangeDetectorRef,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.userid = data.user?._id;
        this.doctor = data.doctor;
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this.route.queryParams.pipe(
      tap(result => {
        this.openid = result.openid;
        this.state = result.state;
      })
    ).subscribe();

    if (this.doctor?._id && this.userid) {
      this.doctorService.checkRelationshipExisted(this.doctor._id, this.userid).pipe(
        tap(rsp => {
          this.relationExisted = rsp;
          this.cd.markForCheck();
        })
      ).subscribe();
      
      // get doctor consult
      this.consultService.getDoctorConsultByDoctorId(this.doctor._id).pipe(
        tap(result => {
          this.tags = result?.tags?.split('|').filter(_ => _);
          this.cd.markForCheck();
        })
      ).subscribe();
    }
  }

  ngOnInit(): void {
    this.core.setTitle('医生首页');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  addFocus() {
    this.doctorService.addRelationship(this.doctor._id, this.userid).pipe(
      tap(result => {
        if (result) {
          this.relationExisted = true;
          this.message.success('关注成功！');
        } else {
          this.message.error();
        }
        this.cd.markForCheck();
      }),
    ).subscribe();
  }

  removeFocus() {
    this.message.confirm('取消关注将断开您与该药师的联系。您确定?', (result) => {
      if (!result) return;
      this.doctorService.removeRelationship(this.doctor._id, this.userid).pipe(
        tap(result => {
          if (result) {
            this.relationExisted = false;
          } else {
            this.message.error();
          }
          this.cd.markForCheck();
        }),
      ).subscribe();
    });
  }

}
