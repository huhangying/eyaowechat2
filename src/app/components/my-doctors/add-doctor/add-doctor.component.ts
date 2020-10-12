import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { Observable, Subject } from 'rxjs';
import { Department } from 'src/app/models/department.model';
import { Doctor } from 'src/app/models/doctor.model';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import weui from 'weui.js';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDoctorComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;
  departments$: Observable<Department[]>;
  doctors$: Observable<Doctor[]>;
  // opened: false;
  selectedDepartment: string;
  myDoctors: Doctor[];

  searchForm: FormGroup;
  filteredDoctors$: Observable<Doctor[]>;
  searchSubmitted: boolean;

  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    private doctorService: DoctorService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
  ) { 
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;

        if (this.user) {
          this.doctorService.getDoctorsByUser(this.user._id).subscribe(
            results => {
              this.myDoctors = results || [];
              this.cd.markForCheck();
            }
          );
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this.departments$ = this.doctorService.getDepartments().pipe(
      tap(deps => {
        if (deps?.length) {}
        this.selectDepartment(deps[0]._id);        
      })
    );

    this.searchForm = this.fb.group({
      name: [''],
    });
  }

  get nameCtrl() { return this.searchForm.get('name'); }

  ngOnInit(): void {
    this.core.setTitle('选择我的药师');
    weui.searchBar('#searchBar');

    this.nameCtrl.valueChanges.pipe(
      tap(value => {
        if (!value) {}
        this.searchReset();
        this.cd.markForCheck();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  // setExpansionStatus(status) {
  //   this.opened = status;
  // }

  selectDepartment(id: string) {
    this.selectedDepartment = id;
    this.doctors$ = this.doctorService.getDoctorsByDepartmentId(id);
    // collapse
    // this.setExpansionStatus(false);
    this.cd.markForCheck();
  }

  searchDoctors() {
    if (this.nameCtrl.value) {
      this.searchSubmitted = true;
      this.filteredDoctors$ = this.doctorService.searchDoctorsByName(this.nameCtrl.value);
      this.cd.markForCheck();
    }
  }

  searchReset() {
    this.searchSubmitted = false;
    this.cd.markForCheck();
  }

}
