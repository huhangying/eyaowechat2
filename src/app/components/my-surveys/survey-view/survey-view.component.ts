import { Component, OnInit, Input } from '@angular/core';
import { Survey } from 'src/app/models/survey/survey.model';
import { SurveyService } from 'src/app/services/survey.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-survey-view',
  templateUrl: './survey-view.component.html',
  styleUrls: ['./survey-view.component.scss']
})
export class SurveyViewComponent implements OnInit {
  @Input() set surveyId(val: string) {
    this.surveyService.getSurveyById(val).pipe(
      tap(result => {
        this.survey = result;
      })
    ).subscribe();
  }
  readonly = true;
  survey: Survey;

  constructor(
    private surveyService: SurveyService,
  ) {
  }

  ngOnInit(): void {
  }

}
