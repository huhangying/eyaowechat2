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

  startMaxDate: moment.Moment;
  endMinDate: moment.Moment;

  constructor(
    private fb: FormBuilder,
    private core: CoreService,
    private feedbackService: FeedbackService,
    private message: MessageService,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<AddFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() @SkipSelf() public data: {
      doctor: Doctor,
      userid: string,
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
      notes: [''],
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
      const newfileName = `${this.doctor._id}.${file.name.split('.').pop()}`; // _id.[ext]

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.avatar = reader.result;
        const formData = new FormData();
        formData.append('file', file, newfileName);// pass new file name in
        this.cd.markForCheck();
        // this.uploadService.upload(formData).pipe(
        //   map(event => {
        //     switch (event.type) {
        //       case HttpEventType.UploadProgress:
        //         file.progress = Math.round(event.loaded * 100 / event.total);
        //         if (event.loaded >= event.total) {
        //           // update icon to db after finished uploading
        //           this.doctorService.updateDoctor({
        //             ...doctor,
        //             icon: newfileName
        //           }).subscribe();
        //         }
        //         break;
        //       case HttpEventType.Response:
        //         return event;
        //     }
        //   }),
        // ).subscribe();
      };
    }

    // let uploadCount = 0;
    // weui.uploader('#uploader', {
    //    url: 'http://localhost:8081',
    //    auto: true,
    //    type: 'file',
    //    fileVal:  e.target.files,
    //    compress: {
    //        width: 1600,
    //        height: 1600,
    //        quality: .8
    //    },
    //    onBeforeQueued: function(files) {
    //        // `this` 是轮询到的文件, `files` 是所有文件

    //        if(["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(this.type) < 0){
    //            weui.alert('请上传图片');
    //            return false; // 阻止文件添加
    //        }
    //        if(this.size > 10 * 1024 * 1024){
    //            weui.alert('请上传不超过10M的图片');
    //            return false;
    //        }
    //        if (files.length > 3) { // 防止一下子选择过多文件
    //            weui.alert('最多只能上传3张图片，请重新选择');
    //            return false;
    //        }
    //        if (uploadCount + 1 > 3) {
    //            weui.alert('最多只能上传3张图片');
    //            return false;
    //        }

    //        ++uploadCount;

    //        // return true; // 阻止默认行为，不插入预览图的框架
    //    },
    //    onQueued: function(){
    //        console.log(this);

    //        // console.log(this.status); // 文件的状态：'ready', 'progress', 'success', 'fail'
    //        // console.log(this.base64); // 如果是base64上传，file.base64可以获得文件的base64

    //        // this.upload(); // 如果是手动上传，这里可以通过调用upload来实现；也可以用它来实现重传。
    //        // this.stop(); // 中断上传

    //        // return true; // 阻止默认行为，不显示预览图的图像
    //    },
    //    onBeforeSend: function(data, headers){
    //        console.log(this, data, headers);
    //        // $.extend(data, { test: 1 }); // 可以扩展此对象来控制上传参数
    //        // $.extend(headers, { Origin: 'http://127.0.0.1' }); // 可以扩展此对象来控制上传头部

    //        // return false; // 阻止文件上传
    //    },
    //    onProgress: function(percent){
    //        console.log(this, percent);
    //        // return true; // 阻止默认行为，不使用默认的进度显示
    //    },
    //    onSuccess: function (ret) {
    //        console.log(this, ret);
    //        // return true; // 阻止默认行为，不使用默认的成功态
    //    },
    //    onError: function(err){
    //        console.log(this, err);
    //        // return true; // 阻止默认行为，不使用默认的失败态
    //    }
    // });
  }

  submit() {
    const feedback = {
      ...this.form.value,
      doctor: this.doctor._id,
      user: this.data.userid,
      type: this.type,
      status: 0
    };
    this.feedbackService.createFeedback(feedback).pipe(
      tap((result: UserFeedback) => {
        if (result?._id) {
          this.message.success();
        }
      })
    ).subscribe();
  }

}
