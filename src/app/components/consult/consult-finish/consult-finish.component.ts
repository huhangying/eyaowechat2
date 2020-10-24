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
  consult: Consult;
  doctor: Doctor;
  user: User;
  score: number;
  form: FormGroup;
  consultComment: DoctorConsultComment;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private consultService: ConsultService,
    private message: MessageService,
  ) {

    this.route.queryParams.pipe(
      tap(params => {
        this.consultId = params.id;
      })
    ).subscribe();

    this.route.data.pipe(
      tap(data => {
        this.user = data.user;
        this.doctor = data.doctor;

        this.consultService.getConsultById(this.consultId).pipe(
          tap(result => {
            this.consult = result;
          })
        ).subscribe();
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
    rater.default({
      element: document.querySelector("#rater"), 
      starSize: 25,
      showToolTip: true,
      rateCallback: (rating, done) => {
        this.score = rating;
        done();
      }
    });
  }

  checkValid() {
    return this.score && this.form.dirty;
  }

  submit() {
    const data = this.form.value;
    if (!this.score && !data.preset1 && !data.preset2 && !data.preset3 && !data.preset4 && !data.comment) {
      this.message.alert('请在提交前先评分和评价，谢谢。');
      return;
    }
    this.consultComment = {
      doctor: this.doctor._id,
      user: this.user._id,
      consult: this.consult?._id,
      consultType: this.consult.type,
      score: this.score,
      comment: data.comment,
    }


  }
}
