import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, Optional, SkipSelf } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { interval } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';
import { MessageService } from 'src/app/core/services/message.service';
import { Doctor } from 'src/app/models/doctor.model';
import { User } from 'src/app/models/user.model';
import { WeixinPayParams } from 'src/app/models/weixin-pay-response.model';
import { WeixinService } from 'src/app/services/weixin.service';
import { OrderService } from 'src/app/services/order.service';
import { AppStoreService } from 'src/app/core/store/app-store.service';

@Component({
  selector: 'app-weixin-pay',
  templateUrl: './weixin-pay.component.html',
  styleUrls: ['./weixin-pay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeixinPayComponent implements OnInit {
  form: FormGroup;
  totalSecond: number;
  remainMinute: number;
  orderId: string;
  orderStartTime: string;
  wxpayReady: boolean;
  payParams: WeixinPayParams;

  constructor(
    private core: CoreService,
    public dialogRef: MatDialogRef<WeixinPayComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() @SkipSelf() public data: {
      doctor: Doctor;
      user: User;
      type: number; // 
      amount: number; // 分
    },
    private wxService: WeixinService,
    private orderService: OrderService,
    private message: MessageService,
    private cd: ChangeDetectorRef,
    private appStore: AppStoreService,
  ) {
    this.wxpayReady = false;
    this.orderStartTime = new Date().toISOString().slice(0, 19).replace(/-|T|:/g, '')
    // orderId format: ORD[type][yymmddhhmmss][dddddd]
    this.orderId = `ord${data.type}${this.orderStartTime}${Math.floor(Math.random() * 1000000)}`;
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('100%', '100%');
    this.core.setTitle('微信支付');

    this.wxService.unifiedOrder(
      this.data.user.link_id,
      this.orderId,
      this.data.amount,
      '药师咨询服务', // body
      this.appStore.hid.toString(), // attach
    ).pipe(
      tap((payParams: WeixinPayParams) => {
        this.payParams = payParams;

        // save to transaction table
        this.orderService.update({
          out_trade_no: this.orderId,
          openid: this.data.user.link_id,
          doctor: this.data.doctor._id,
          userName: this.data.user.name,
          doctorName: this.data.doctor.name,
          consultType: this.data.type,
          amount: this.data.amount,

          prepay_id: payParams.package,
          status: 'pending', // initial status, replaced by unifiedOrder.result_code
        }).subscribe();

        // Weixin Pay
        if (typeof (<any>window).WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
          } else if ((<any>document).attachEvent) {
            // @ts-ignore
            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
            (<any>document).attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
          }
        } else {
          this.onBridgeReady();
        }
      })
    ).subscribe();
  }


  invokeWeixinPay() {
    //   "appId": this.unifiedOrder.appid,
    //   "timeStamp": timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
    //   "nonceStr": this.unifiedOrder.nonce_str, // 支付签名随机串，不长于 32 位
    //   "package": 'prepay_id=' + this.unifiedOrder.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
    //   "signType": 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
    //   "paySign": this.unifiedOrder.sign, // 支付签名
    // @ts-ignore
    window.WeixinJSBridge?.invoke(
      'getBrandWCPayRequest', this.payParams,
      (res) => {
        this.wxpayReady = false;
        if (res.err_msg == 'get_brand_wcpay_request:ok') {
          // 使用以上方式判断前端返回,微信团队郑重提示：
          //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          this.success(this.orderId);
          this.cd.markForCheck();
        } else if (res.err_msg == 'get_brand_wcpay_request:fail') {
          this.message.success('支付失败：' + res.err_msg);
        } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
          this.message.success('用户取消支付');
        } else {
          this.message.success('支付失败，请稍后再试');
        }
      });

    this.wxpayReady = true;
    // this.startCountdownTimer();
  }

  onBridgeReady() {
    this.invokeWeixinPay();
  }

  startCountdownTimer() {
    this.totalSecond = 300; // 5 minutes
    this.remainMinute = Math.floor(this.totalSecond / 60);
    const timer$ = interval(1000).pipe(
      tap(() => {
        this.totalSecond -= 1;
        this.remainMinute = Math.floor(this.totalSecond / 60);
        if (this.totalSecond <= 0) {
          timer$.unsubscribe();
          // @ts-ignore
          window.WeixinJSBridge.call('closeWindow');
          this.back();
        }
        this.cd.markForCheck();
      })
    ).subscribe()
  }

  back() {
    this.wxpayReady = false;
    this.dialogRef.close(false);
  }

  success(out_trade_no: string) {
    this.wxpayReady = false;
    this.dialogRef.close(out_trade_no);
  }
}
