import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import weui from 'weui.js';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'src/app/core/services/message.service';
import { AppStoreService } from 'src/app/core/store/app-store.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  form: FormGroup;
  user: User;
  birthdate: Date;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private core: CoreService,
    private fb: FormBuilder,
    private userService: UserService,
    private message: MessageService,
    private appStore: AppStoreService,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      gender: [''],
      cell: [''],
      sin: [''],
      admissionNumber: [''],
    });

    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        this.birthdate = this.user.birthdate && new Date(this.user.birthdate);
        this.form.patchValue(this.user);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.core.setTitle('健康档案');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  selectBirthdate() {
    weui.datePicker({
      start: 1920,
      defaultValue: this.birthdate ? this.core.date2WeuiDate(this.birthdate) : [1980, 1, 1],
      end: new Date(),
      onConfirm: (picker) => {
        // console.log(picker);
        this.birthdate = this.core.weuiDate2Date(picker);
      },
      title: '选择出生日期',
    });
  }

  save() {
    this.userService.updateById(this.user._id, {
      ...this.form.value,
      birthdate: this.birthdate
    }).subscribe((result: User) => {
      if (result?._id) {
        this.message.success('保存成功！');
        // save to store
        this.appStore.updateUser(result);
        this.router.navigate(['/profile'], { queryParams: this.route.snapshot.queryParams });
      }
    });
  }

}
