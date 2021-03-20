import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { MessageService } from 'src/app/core/services/message.service';
import { Advise } from 'src/app/models/survey/advise.model';
import { AdviseService } from 'src/app/services/advise.service';
import * as rater from 'rater-js';

@Component({
  selector: 'app-advise-comment',
  templateUrl: './advise-comment.component.html',
  styleUrls: ['./advise-comment.component.scss']
})
export class AdviseCommentComponent implements OnInit {
  @Input() advise: Advise;
  score: number;
  comment: string;
  readonly: boolean;
  doctorRater: any;
  
  constructor(
    private message: MessageService,
    private adviseService: AdviseService,
  ) {
    this.score = this.advise?.score || 0;
    this.comment = this.advise?.comment || '';
   }

  ngOnInit(): void {
    this.doctorRater = rater.default({
      element: document.querySelector("#rater"),
      starSize: 25,
      showToolTip: true,
      rateCallback: (rating, done) => {
        this.score = (rating > 0) ? rating : 0;
        done();
      }
    });
  }

  submit() {
    if (!this.score && !this.comment) {
      this.message.success('请在提交前先评分和评价，谢谢。');
      return;
    }

    const adviseComment: Advise = {
      _id: this.advise._id,
      name: this.advise.name,
      doctor: this.advise.doctor,
      // user: this.advise.user,
      score: this.score,
      comment: this.comment,
      feedbackDone: true,
    }

    // save
    this.adviseService.updateAdvise(adviseComment).pipe(
      tap(result => {
        if (result?._id) {
          this.message.toast('谢谢您的反馈！');
          // disable
          this.readonly = true;
          this.doctorRater.disable();
        }
      })
    ).subscribe();
  }

}
