import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyService } from 'src/app/services/survey.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { SurveyGroup } from 'src/app/models/survey/survey-group.model';
import { CoreService } from 'src/app/core/services/core.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-survey-start',
  templateUrl: './survey-start.component.html',
  styleUrls: ['./survey-start.component.scss']
})
export class SurveyStartComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;
  surveryGroup: SurveyGroup;

  constructor(
    private route: ActivatedRouteSnapshot,
    private core: CoreService,
    public dialog: MatDialog,
    private surveyService: SurveyService,
  ) {
    // this.route..pipe(
    //   distinctUntilChanged(),
    //   tap(data => {
    //     const { doctorid, type, date } = this.route.queryParams;
    //     this.user = data.user;
    //     if (this.user?._id) {
    //       // this.surveryGroups$ = this.surveyService.getMySurveyGroups(this.user._id);
    //     }
    //   }),
    //   takeUntil(this.destroy$)
    // ).subscribe();
   }

  ngOnInit(): void {
    const { openid, doctorid, type, date } = this.route.queryParams;
    this.user = this.route.data.user;
    console.log(this.user);
    

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }


}
