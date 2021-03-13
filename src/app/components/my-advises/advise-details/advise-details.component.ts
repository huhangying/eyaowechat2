import { Component, Input, OnInit } from '@angular/core';
import { Advise } from 'src/app/models/survey/advise.model';


@Component({
  selector: 'app-advise-details',
  templateUrl: './advise-details.component.html',
  styleUrls: ['./advise-details.component.scss']
})
export class AdviseDetailsComponent implements OnInit {
  @Input() advise: Advise;

  constructor(

  ) {
  }

  ngOnInit(): void {
  }

}
