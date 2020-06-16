import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import weui from 'weui.js';

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
    private route: ActivatedRoute,
    private core: CoreService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      cell: [''],
      sin: [''],
      admissionNumber: [''],
    });

    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        this.birthdate = new Date(this.user.birthdate);
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
    console.log(this.birthdate);

    weui.datePicker({
      start: 1920,
      defaultValue: this.birthdate? this.core.date2WeuiDate(this.birthdate): [1980, 1, 1],
      end: new Date(),
      onConfirm: (picker) => {
        // console.log(picker);
        this.birthdate = this.core.weuiDate2Date(picker);
      },
      title: '选择出生日期',
    });
  }

  save() {
    const _user = {
      ...this.form.value,
      birthdate: this.birthdate
    }
    weui.alert(JSON.stringify(_user));
  }

}
