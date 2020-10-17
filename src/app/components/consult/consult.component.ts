import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, tap, takeUntil } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';
import { MessageService } from 'src/app/core/services/message.service';
import { UploadService } from 'src/app/core/services/upload.service';
import { Consult } from 'src/app/models/consult/consult.model';
import { Doctor } from 'src/app/models/doctor.model';
import { User } from 'src/app/models/user.model';
import { ConsultService } from 'src/app/services/consult.service';
import weui from 'weui.js';

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  form: FormGroup;
  doctor: Doctor;
  user: User;
  consult: Consult;
  type: number;
  avatar: any;
  upload: string; // img path

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private core: CoreService,
    private consultService: ConsultService,
    private uploadService: UploadService,
    private message: MessageService,
    private cd: ChangeDetectorRef,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        this.doctor = data.doctor;
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this.form = this.fb.group({
      userName: ['', Validators.required],
      diseaseType: ['', Validators.required],
      address: [''],
      cell: [''],
      content: ['', Validators.required],
    });
  }

  get diseaseTypeCtrl() { return this.form.get('diseaseType'); }

  ngOnInit(): void {
    this.core.setTitle('药师咨询详情');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  selectDiseases() {
    weui.picker([
      '飞机票', '火车票', '汽车票'
    ], {
      defaultValue: [this.diseaseTypeCtrl.value],
      onConfirm: (result) => {
        this.diseaseTypeCtrl.patchValue(result[0].value);
        this.cd.markForCheck();
      },
      id: 'disease-type'
    });
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
        this.uploadService.uploadUserDir(this.user._id, this.type.toString(), newFile, newfileName).pipe(
          tap((result: { path: string }) => {
            this.upload = result?.path;
          })
        ).subscribe();
      };
    }
  }

  submit() {
    const consult = {
      ...this.form.value,
      doctor: this.doctor._id,
      user: this.user._id,
      type: this.type, //
      upload: this.upload,
    };
    this.consultService.AddConsult(consult).pipe(
      tap((result: Consult) => {
        if (result?._id) {
          this.message.success();
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

  // validation
  checkValidation(selectedElement?: string) {
    // weui.form.validate(dq);
    weui.form.validate(selectedElement || '#form');
    this.cd.markForCheck();
  }
}
