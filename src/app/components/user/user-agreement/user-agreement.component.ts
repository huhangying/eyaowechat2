import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'app-user-agreement',
  templateUrl: './user-agreement.component.html',
  styleUrls: ['./user-agreement.component.scss']
})
export class UserAgreementComponent implements OnInit {

  constructor(
    private core: CoreService,
  ) { }

  ngOnInit(): void {
    this.core.setTitle('用户服务协议');
  }

}
