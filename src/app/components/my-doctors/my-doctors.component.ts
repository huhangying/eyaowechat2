import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'app-my-doctors',
  templateUrl: './my-doctors.component.html',
  styleUrls: ['./my-doctors.component.scss']
})
export class MyDoctorsComponent implements OnInit {
  user: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private core: CoreService,
  ) {
    this.route.data.subscribe(data => {
      this.user = data.user;
    });
   }

  ngOnInit(): void {
    this.core.setTitle('我的药师团队');

  }

  addDoctor() {
    this.router.navigate(['/add-doctor'], {state: {user: this.user}});
  }

}
