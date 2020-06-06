import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { Observable } from 'rxjs';
import { Department } from 'src/app/models/department.model';
import { Doctor } from 'src/app/models/doctor.model';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDoctorComponent implements OnInit {
  user: User;
  departments$: Observable<Department[]>;
  doctors$: Observable<Doctor[]>;
  opened: false;

  constructor(
    private router: Router,
    private core: CoreService,
    private doctorService: DoctorService,
    private cd: ChangeDetectorRef,
  ) { 
    this.user = this.router.getCurrentNavigation().extras?.state?.user || {};
    this.departments$ = this.doctorService.getDepartments();
  }

  ngOnInit(): void {
    this.core.setTitle('选择我的药师');

  }

  setExpansionStatus(status) {
    this.opened = status;
  }

  selectDepartment(id: string) {
    this.doctors$ = this.doctorService.getDoctorsByDepartmentId(id);
    // collapse
    this.setExpansionStatus(false);
    this.cd.markForCheck();
  }

}
