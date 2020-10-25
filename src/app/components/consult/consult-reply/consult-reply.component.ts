import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';
import { AppStoreService } from 'src/app/core/store/app-store.service';
import { Consult } from 'src/app/models/consult/consult.model';
import { Doctor } from 'src/app/models/doctor.model';
import { User } from 'src/app/models/user.model';
import { ConsultService } from 'src/app/services/consult.service';
import { WeixinService } from 'src/app/services/weixin.service';

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

  openid: string;
  state: number;

  constructor(
    private core: CoreService,
    private route: ActivatedRoute,
    private router: Router,
    private appStore: AppStoreService,
    private consultService: ConsultService,
    private wxService: WeixinService,
    private cd: ChangeDetectorRef,
  ) {
    this.route.queryParams.pipe(
      tap(params => {
        this.consultId = params.id;
        this.openid = params.openid;
        this.state = params.state;
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
    this.core.setTitle('药师咨询回复');
  }

  scrollTo(consultid: string) {
    this.cd.markForCheck();
    setTimeout(() => {
      document.getElementById(consultid)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      this.cd.markForCheck();
    }, 200);
  }

  back() {
    this.wxService.closeWindow();
  }

  goChat() {
    this.router.navigate(['/chat'], {
      queryParams: {
        doctorid: this.doctor._id,
        openid: this.appStore.token?.openid || this.openid,
        state: this.appStore.hid || this.state,
      }
    });
  }

}
