import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-doctors',
  templateUrl: './my-doctors.component.html',
  styleUrls: ['./my-doctors.component.scss']
})
export class MyDoctorsComponent implements OnInit {
  user: User;

  constructor(
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe(data => {
      this.user = data.user;
    });
   }

  ngOnInit(): void {

  }

}
