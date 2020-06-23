import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { Subject, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { distinctUntilChanged, tap, takeUntil, filter, map } from 'rxjs/operators';
import { SurveyService } from 'src/app/services/survey.service';
import { SurveyGroup } from 'src/app/models/survey/survey-group.model';
import { MatDialog } from '@angular/material/dialog';
import { SurveyEditComponent } from './survey-edit/survey-edit.component';

@Component({
  selector: 'app-my-surveys',
  templateUrl: './my-surveys.component.html',
  styleUrls: ['./my-surveys.component.scss']
})
export class MySurveysComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;
  surveryGroups$: Observable<SurveyGroup[]>

  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    public dialog: MatDialog,
    private surveyService: SurveyService,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        if (this.user?._id) {
          this.surveryGroups$ = this.surveyService.getMySurveyGroups(this.user._id);
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
   }

  ngOnInit(): void {
    this.core.setTitle('我的问卷');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  getNameByType(type: number) {
    return this.surveyService.getSurveyGroupNameByType(type);
  }

  goDetails(surveyGroup: SurveyGroup) {
    const pageTitle = this.surveyService.getSurveyGroupNameByType(surveyGroup.type);
    this.dialog.open(SurveyEditComponent, {
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: {
        surveyGroup: surveyGroup,
        user: this.user,
        title: pageTitle,
      }
    }).afterClosed().subscribe((gkey) => {
      if (gkey) { // 已完成
        this.surveryGroups$ = this.surveryGroups$.pipe(
          map(groups => groups.filter(_ => _.groupkey !== gkey))
        );
      }
      this.core.setTitle('我的问卷');
    });
  }

}
