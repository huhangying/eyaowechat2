import { Component, OnInit, Input } from '@angular/core';
import { PageType } from 'src/app/core/enum/page.enum';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-select-doctors',
  templateUrl: './select-doctors.component.html',
  styleUrls: ['./select-doctors.component.scss']
})
export class SelectDoctorsComponent implements OnInit {
  @Input() pageType: PageType;
  @Input() user: User;

  constructor(
  ) {

  }

  ngOnInit(): void {
  }

}
