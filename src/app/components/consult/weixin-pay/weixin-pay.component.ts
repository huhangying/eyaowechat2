import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, Optional, SkipSelf } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { interval } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'app-weixin-pay',
  templateUrl: './weixin-pay.component.html',
  styleUrls: ['./weixin-pay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeixinPayComponent implements OnInit {
  form: FormGroup;
  // countdown timer
  totalSecond: number;
  remainMinute: number;
  
  constructor(
    private core: CoreService,
    public dialogRef: MatDialogRef<WeixinPayComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() @SkipSelf() public data: {

    },
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.dialogRef.updateSize('100%', '100%');
    this.core.setTitle('微信支付');

    this.totalSecond = 300; // 5 minutes
    this.remainMinute = Math.floor(this.totalSecond/60);
    const timer$ = interval(1000).pipe(
      tap(() => {
        this.totalSecond -= 1;
        this.remainMinute = Math.floor(this.totalSecond/60);
        if (this.totalSecond <= 0) {
          console.log('done');
          timer$.unsubscribe();
        }
        this.cd.markForCheck();
      })
    ).subscribe()

  }

  back() {
    this.dialogRef.close(false);
  }

  success() {
    this.dialogRef.close(true);
  }

}
