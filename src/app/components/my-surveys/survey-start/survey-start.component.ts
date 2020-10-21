import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyService } from 'src/app/services/survey.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { SurveyGroup } from 'src/app/models/survey/survey-group.model';
import { CoreService } from 'src/app/core/services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { tap, takeUntil } from 'rxjs/operators';
import { SurveyEditComponent } from '../survey-edit/survey-edit.component';
import { AppStoreService } from 'src/app/core/store/app-store.service';

@Component({
  selector: 'app-survey-start',
  templateUrl: './survey-start.component.html',
  styleUrls: ['./survey-start.component.scss']
})
export class SurveyStartComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;
  surveryGroup: SurveyGroup;
  pageTitle: string;
  openid: string;
  hid: string;
  loaded =false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private core: CoreService,
    public dialog: MatDialog,
    private appStore: AppStoreService,
    private surveyService: SurveyService,
  ) {
  }

  ngOnInit(): void {    
    this.route.data.pipe(
      tap(data => {
        this.user = data.user;
        const { openid, doctorid, type, date, state } = this.route.snapshot.queryParams;
        this.pageTitle = '我的' + this.surveyService.getSurveyGroupNameByType(+type);
        this.core.setTitle(this.pageTitle);
        this.openid = openid;
        this.hid = state;
        if (this.user?._id) {
          this.surveyService.getMySurveysStart(
            this.user._id,
            doctorid,
            type,
            date
          ).subscribe(results => {
            if (results.length) {
              this.surveryGroup = {
                type: type,
                surveys: results,
                groupkey: 'userEdit'
              }
            } else {
              this.loaded = true;
            }
            if (this.surveryGroup) {
              this.goDetails(this.surveryGroup);
            }            
          });
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
  
  goDetails(surveyGroup: SurveyGroup) {
    this.dialog.open(SurveyEditComponent, {
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: {
        surveyGroup: surveyGroup,
        user: this.user,
        title: this.pageTitle
      }
    }).afterClosed().subscribe((gkey) => {
      if (gkey) { // 已完成
        this.router.navigate(['/add-doctor'], {
          queryParams: {
            openid: this.appStore.token?.openid ||this.openid,
            state: this.appStore.hid || this.hid
          }
        });
      }
      this.core.setTitle('我的问卷');
    });
  }

}
