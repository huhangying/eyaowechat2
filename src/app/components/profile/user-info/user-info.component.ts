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
        this.birthdate = this.user.birthdate;
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
      default: 1980,
      onConfirm: (result) => {
        this.birthdate = new Date(result);
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
