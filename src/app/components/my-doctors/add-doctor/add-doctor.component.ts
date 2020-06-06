import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss']
})
export class AddDoctorComponent implements OnInit {
  user: User;

  constructor(
    private router: Router,
    private core: CoreService,
  ) { 
    this.user = this.router.getCurrentNavigation().extras?.state?.user;
  }

  ngOnInit(): void {
    this.core.setTitle('选择我的药师');

  }

}
