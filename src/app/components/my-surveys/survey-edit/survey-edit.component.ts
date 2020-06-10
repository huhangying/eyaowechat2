import { Component, OnInit, Inject, Optional, SkipSelf } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { SurveyService } from 'src/app/services/survey.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { SurveyGroup } from 'src/app/models/survey/survey-group.model';
import { Survey } from 'src/app/models/survey/survey.model';
import { Question } from 'src/app/models/survey/survey-template.model';
import { tap } from 'rxjs/operators';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-survey-edit',
  templateUrl: './survey-edit.component.html',
  styleUrls: ['./survey-edit.component.scss']
})
export class SurveyEditComponent implements OnInit {
  surveys: Survey[];
  surveyIndex = 0;
  questionIndex = 0;

  constructor(
    private core: CoreService,
    private message: MessageService,
    private surveyService: SurveyService,
    public dialogRef: MatDialogRef<SurveyEditComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() @SkipSelf() public data: {
      surveyGroup: SurveyGroup,
      user: User,
    },
  ) {
    this.surveys = [...data.surveyGroup.surveys];
  }

  get surveyName() {
    return this.surveys[this.surveyIndex]?.name;
  }
  
  get question() {
    return this.surveys[this.surveyIndex]?.questions[this.questionIndex];
  }

  get questionCount() {
    return this.surveys[this.surveyIndex].questions?.length;
  }

  get questionValid() {
    if (!this.question.required) return true;
    let isValid = false;
    this.question.options.map(_ => {
      if (this.question.answer_type === 3) {
        if (_.input) {
          isValid = true;
        }
      } else {
        if (_.selected) {
          isValid = true;
        }
      }
    });
    return isValid;
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('100%', '100%');
    this.core.setTitle(this.surveyService.getSurveyGroupNameByType(this.data.surveyGroup.type));
  }

  getQuestionType(type: number) {
    if (type === 1) {
      return `[单选]`;
    } else if (type === 2) {
      return '[多选]';
    }
    return [];
  }

  changeRadioSelection(question: Question, index: number) {
    // const checked = options[index].selected;
    question.options.forEach((option, i) => option.selected = i === index);
  }

  prev() {
    if (this.questionIndex > 0) {
      this.questionIndex--;
    } else {
      // go previous survey
      if (this.surveyIndex > 0) {
        this.surveyIndex--;
        this.questionIndex = this.questionCount -1;
      }
    }
  }

  next() {
    // check required
    if (!this.questionValid) {
      this.message.error('本题为必选，请选择后再试。');
      return;
    }

    if (this.questionIndex < this.questionCount -1) {
      this.questionIndex++;
    } else {
      // save
      this.surveyService.saveSurvey(this.surveys[this.surveyIndex]).pipe(
        tap(savedSurvey => {
          if (savedSurvey?._id) {
            this.message.success(savedSurvey.name + '已保存', 1500);
            // go next survey or finish
            if (this.surveyIndex < this.surveys.length -1) {
              this.surveyIndex++;
              this.questionIndex = 0;
            } else {
              // finished
              this.finished();
            }
          }
        })
      ).subscribe();
    }
  }

  reset() {
    this.question.options.map(_ => {
      _.selected = false;
      _.input = '';
      return _;
    });
  }

  finished() {
    // mark all surveys finished
    this.surveys.map(survey => {
      survey.finished = true;
      this.surveyService.saveSurvey(survey).subscribe();
    });
    //
    this.message.confirm('您的问卷已反馈给药师。请确定完成。', (result) => {
      if (result) {
        this.dialogRef.close(this.data.surveyGroup.groupkey);
      }
    });
  }

}
