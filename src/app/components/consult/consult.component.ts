import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, tap, takeUntil } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';
import { MessageService } from 'src/app/core/services/message.service';
import { SocketioService } from 'src/app/core/services/soketio.service';
import { UploadService } from 'src/app/core/services/upload.service';
import { Consult } from 'src/app/models/consult/consult.model';
import { DoctorConsult } from 'src/app/models/consult/doctor-consult.model';
import { Doctor } from 'src/app/models/doctor.model';
import { User } from 'src/app/models/user.model';
import { ConsultService } from 'src/app/services/consult.service';
import { WeixinService } from 'src/app/services/weixin.service';
import weui from 'weui.js';
import { WeixinPayComponent } from './weixin-pay/weixin-pay.component'

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
  doctorConsult: DoctorConsult;
  type: number;
  diseaseTypes: string[];
  room: string;

  avatar: any;
  upload: string; // img path
  isPaid = false;
  consultAmount: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private core: CoreService,
    private consultService: ConsultService,
    private uploadService: UploadService,
    private socketio: SocketioService,
    public dialog: MatDialog,
    private message: MessageService,
    private wxService: WeixinService,
    private cd: ChangeDetectorRef,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        this.doctor = data.doctor;

        this.doctorConsult = data.doctorConsult;
        this.diseaseTypes = this.doctorConsult?.disease_types?.split('|') || [];
        this.diseaseTypes.push('其它');
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this.route.queryParams.pipe(
      tap(params => {
        this.type = +params.type;
      })
    ).subscribe();

    this.form = this.fb.group({
      userName: [this.user.name],
      diseaseType: [''],
      address: [''],
      content: [''],
    });
    if (this.type === 1) {
      this.form.addControl('cell', new FormControl(this.user.cell))
      this.form.get('cell').setValidators([Validators.required]);
    }

    this.socketio.setupSocketConnection(); // it would be created later for performance
  }

  get diseaseTypeCtrl() { return this.form.get('diseaseType'); }

  ngOnInit(): void {
    this.core.setTitle(this.type === 0 ? '药师图文咨询' : (this.type === 1 ? '药师电话咨询' : '药师咨询详情'));

    this.room = this.doctor?._id;
    this.socketio.joinRoom(this.room);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.socketio.leaveRoom(this.room);
  }

  hasErrors(id: string) {
    const control = this.form.get(id);
    return control?.invalid && control?.touched;
  }

  selectDiseases() {
    weui.picker(
      this.diseaseTypes,
      {
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
    this.isPaid = true;
    this.dialog.open(WeixinPayComponent, {
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: {
        doctor: this.doctor,
        user: this.user,
        type: this.type,
        amount: this.consultAmount * 100,
      }
    }).afterClosed()
      .subscribe((result) => {
        if (!result) {
          // this.message.error('支付失败或取消');
          this.isPaid = false;
          this.cd.markForCheck();
          return;
        }

        this.message.success('支付成功');
        // this.core.setTitle(currentTitle);

        const consult = {
          ...this.form.value,
          disease_types: [this.diseaseTypeCtrl.value],
          doctor: this.doctor._id,
          user: this.user._id,
          type: this.type, //
          upload: this.upload,
          setCharged: true, // 付费标记
        };

        this.consultService.AddConsult(consult).pipe(
          tap((result: Consult) => {
            if (result?._id) {
              this.socketio.sendConsult(this.room, result);
              // 删除药师pending consult （type=null, finished: false）
              this.consultService.deletePendingByDoctorIdAndUserId(this.doctor._id, this.user._id).subscribe();
              // this.message.success();

              // redirect to confirm page
              this.goConsultConfirmed(result._id);
            }
          })
        ).subscribe();
      });

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
  checkValidation() {
    weui.form.validate('#form');
    this.cd.markForCheck();
  }

  getTypePrice(): number {
    this.consultAmount = this.doctor.prices.find(_ => _.type === this.type)?.amount || 0;
    return this.consultAmount;
  }

  goConsultConfirmed(consultId: string) {
    weui.form.validate('#form', error => {
      if (!error) { return; }
      this.router.navigate(['/consult-confirm'], {
        queryParams: {
          ...this.route.snapshot.queryParams,
          id: consultId
        }
      });
    });
  }

  close() {
    this.wxService.closeWindow();
  }
}
