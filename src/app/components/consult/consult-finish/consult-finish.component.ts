import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Consult } from 'src/app/models/consult/consult.model';
import { Doctor } from 'src/app/models/doctor.model';
import { User } from 'src/app/models/user.model';
import { ConsultService } from 'src/app/services/consult.service';
import * as rater from 'rater-js';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'src/app/core/services/message.service';
import { DoctorConsultComment } from 'src/app/models/consult/doctor-consult-comment.model';

@Component({
  selector: 'app-consult-finish',
  templateUrl: './consult-finish.component.html',
  styleUrls: ['./consult-finish.component.scss']
})
export class ConsultFinishComponent implements OnInit {
  consultId: string;
  type: number;
  doctor: Doctor;
  user: User;
  score: number;
  form: FormGroup;
  readonly = false;
  doctorRater: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private consultService: ConsultService,
    private message: MessageService,
  ) {

    this.route.queryParams.pipe(
      tap(params => {
        this.consultId = params.id;
        this.type = +params.type;
      })
    ).subscribe();

    this.route.data.pipe(
      tap(data => {
        this.user = data.user;
        this.doctor = data.doctor;
      }),
    ).subscribe();

    this.form = this.fb.group({
      preset1: [''],
      preset2: [''],
      preset3: [''],
      preset4: [''],
      comment: [''],
    });
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

    this.consultService.getDoctorConsultCommentByConsultId(this.consultId).pipe(
      tap(result => {
        if (result) {
          this.readonly = true;
          this.populateForm(result);
        }
      })
    ).subscribe();

  }

  populateForm(comment: DoctorConsultComment) {
    if (comment) {
      this.form.patchValue({
        preset1: comment.presetComments?.find(_ => _.type === 1).checked,
        preset2: comment.presetComments?.find(_ => _.type === 2).checked,
        preset3: comment.presetComments?.find(_ => _.type === 3).checked,
        preset4: comment.presetComments?.find(_ => _.type === 4).checked,
        comment: comment.comment,
      });
      this.score = comment.score;
      this.doctorRater.setRating(this.score);
      this.doctorRater.disable();

      this.form.disable();
    }
  }

  submit() {
    const data = this.form.value;
    if (!this.score && !data.preset1 && !data.preset2 && !data.preset3 && !data.preset4 && !data.comment) {
      this.message.success('请在提交前先评分和评价，谢谢。');
      return;
    }

    const consultComment = {
      doctor: this.doctor._id,
      user: this.user._id,
      consult: this.consultId,
      consultType: this.type,
      score: this.score,
      comment: data.comment,
      presetComments: [
        { type: 1, checked: data.preset1 },
        { type: 2, checked: data.preset2 },
        { type: 3, checked: data.preset3 },
        { type: 4, checked: data.preset4 },
      ]
    }

    // save
    this.consultService.addDoctorConsultComment(consultComment).pipe(
      tap(result => {
        if (result?._id) {
          this.message.toast('谢谢您的反馈！');
          // disable
          this.readonly = false;
        }
      })
    ).subscribe();
  }
}
