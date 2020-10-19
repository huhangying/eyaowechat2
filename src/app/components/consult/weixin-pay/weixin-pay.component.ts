import { Component, Inject, OnInit, Optional, SkipSelf } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'app-weixin-pay',
  templateUrl: './weixin-pay.component.html',
  styleUrls: ['./weixin-pay.component.scss']
})
export class WeixinPayComponent implements OnInit {
  form: FormGroup;
  
  constructor(
    private core: CoreService,
    public dialogRef: MatDialogRef<WeixinPayComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() @SkipSelf() public data: {

    },
  ) { }

  ngOnInit(): void {
    this.dialogRef.updateSize('100%', '100%');
    this.core.setTitle('微信支付');
  }

  back() {
    this.dialogRef.close();
  }
}
