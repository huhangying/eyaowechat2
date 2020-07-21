import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { Observable, Subject } from 'rxjs';
import { Department } from 'src/app/models/department.model';
import { Doctor } from 'src/app/models/doctor.model';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';

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

  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    private doctorService: DoctorService,
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
  }

  ngOnInit(): void {
    this.core.setTitle('选择我的药师');
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

}
