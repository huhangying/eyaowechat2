import { Component, OnInit, Optional, Inject, SkipSelf, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Doctor } from 'src/app/models/doctor.model';
import { UserFeedback } from 'src/app/models/user-feedback.model';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FeedbackService } from 'src/app/services/feedback.service';
import { tap, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { MessageService } from 'src/app/core/services/message.service';
import { Subject } from 'rxjs';
import { UploadService } from 'src/app/core/services/upload.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-add-feedback',
  templateUrl: './add-feedback.component.html',
  styleUrls: ['./add-feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddFeedbackComponent implements OnInit, OnDestroy {
  form: FormGroup;
  destroy$ = new Subject<void>();
  doctor: Doctor;
  feedback: UserFeedback;
  type: number;
  typeLabel: string;
  avatar: any;
  upload: string; // img path

  startMaxDate: moment.Moment;
  endMinDate: moment.Moment;

  constructor(
    private fb: FormBuilder,
    private core: CoreService,
    private feedbackService: FeedbackService,
    private uploadService: UploadService,
    private message: MessageService,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<AddFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() @SkipSelf() public data: {
      doctor: Doctor,
      user: User,
      type: number // 1: adverse reaction 2.dose combination
    },
  ) {
    this.doctor = data.doctor;
    this.type = data.type;
    this.typeLabel = this.type === 1 ? '不良反应' : '联合用药';
    this.feedback = {};

    this.form = this.fb.group({
      name: ['', Validators.required],
      how: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  get startDate() { return this.form.get('startDate'); }
  get endDate() { return this.form.get('endDate'); }

  ngOnInit(): void {
    this.dialogRef.updateSize('100%', '100%');
    this.core.setTitle(this.typeLabel + '反馈');

    this.startDate.valueChanges.pipe(
      distinctUntilChanged(),
      filter(_ => _),
      tap(value => {
        this.endMinDate = moment(value);
        this.cd.markForCheck();
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this.endDate.valueChanges.pipe(
      distinctUntilChanged(),
      filter(_ => _),
      tap(value => {
        this.startMaxDate = moment(value);
        this.cd.markForCheck();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  imageUpload(event) {
    if (event.target.files?.length) {
      const [file] = event.target.files;
      const newfileName = `.${file.name.split('.').pop()}`; // _id.[ext]

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        this.avatar = reader.result;
        this.cd.markForCheck();

        const newFile = await this.uploadService.compressImg(file);
        this.uploadService.uploadUserDir(this.data.user._id, this.type.toString(), newFile, newfileName).pipe( 
          tap((result: {path: string}) => {
            this.upload = result?.path;
          })
        ).subscribe();
      };
    }
  }

  submit() {
    const feedback = {
      ...this.form.value,
      doctor: this.doctor._id,
      user: this.data.user._id,
      senderName: this.data.user.name,
      type: this.type,
      upload: this.upload,
      status: 0
    };
    this.feedbackService.createFeedback(feedback).pipe(
      tap((result: UserFeedback) => {
        if (result?._id) {
          this.message.success();
          this.dialogRef.close(result);
        }
      })
    ).subscribe();
  }

  removeUploaded() {
    this.uploadService.removeFile(this.upload).pipe(
      tap(result => {
        this.avatar = null;
        this.upload = '';
        this.cd.markForCheck();
        this.message.success('图片已删除');
      })
    ).subscribe();
  }

  back() {
    this.dialogRef.close();
  }

}
