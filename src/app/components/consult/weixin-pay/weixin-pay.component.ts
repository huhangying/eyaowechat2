import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, Optional, SkipSelf } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, interval } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';
import { MessageService } from 'src/app/core/services/message.service';
import { Doctor } from 'src/app/models/doctor.model';
import { User } from 'src/app/models/user.model';
import { WeixinPayResponse, WxJsapiResponse } from 'src/app/models/weixin-pay-response.model';
import { WeixinService } from 'src/app/services/weixin.service';
import { OrderService } from 'src/app/services/order.service';
import wx from 'weixin-js-sdk';
import { Order } from 'src/app/models/consult/order.model';
import weui from 'weui.js';

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
  orderId: string;
  orderStartTime: string;
  wxpayReady: boolean;
  unifiedOrder: WeixinPayResponse;
  order: Order;

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
      // '药师咨询服务' + this.orderId,
      // '支付'
      'Test',
      'test'
    ).pipe(
      tap((unifiedOrder: WeixinPayResponse) => {
        if (unifiedOrder.result_code !== 'SUCCESS') {
          this.message.error(unifiedOrder?.err_code + ': ' + unifiedOrder?.err_code_des);
          return;
        } else {
          this.unifiedOrder = unifiedOrder;

          // save to transaction table
          this.orderService.update({
            openid: this.data.user.link_id,
            doctor: this.data.doctor._id,
            orderId: this.orderId,
            userName: this.data.user.name,
            doctorName: this.data.doctor.name,
            consultType: this.data.type,
            amount: this.data.amount,

            prepay_id: unifiedOrder.prepay_id,
            status: unifiedOrder.result_code, // res.
            startTime: this.orderStartTime,
          }).subscribe(rsp => {
            this.order = rsp;

          });

          this.invokeWeixinPay();
        }
      })
    ).subscribe();
  }


  invokeWeixinPay() {
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
  }

  onBridgeReady() {
    // this.message.alert(JSON.stringify(this.unifiedOrder))
    const timestamp = Math.floor(new Date().getTime() / 1000) + '';
    (<any>window).WeixinJSBridge?.invoke(
      'getBrandWCPayRequest', {
      "appId": this.unifiedOrder.appid,
      "timeStamp": timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      "nonceStr": this.unifiedOrder.nonce_str, // 支付签名随机串，不长于 32 位
      "package": 'prepay_id=' + this.unifiedOrder.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
      "signType": 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      "paySign": this.unifiedOrder.sign, // 支付签名
    },
      function (res) {
        alert(JSON.stringify(res));
        if (res.errMsg == 'get_brand_wcpay_request:ok') {
          // 使用以上方式判断前端返回,微信团队郑重提示：
          //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          // this.success();
        } else if (res.errMsg == 'get_brand_wcpay_request:fail') {
          this.message.success('支付失败：' + res.errMsg);
        } else if (res.errMsg == 'get_brand_wcpay_request:cancel') {
          this.message.success('用户取消支付');
        } else {
          this.message.success('支付失败，请稍后再试');
        }
      });
  }

  startCountdownTimer() {
    this.wxpayReady = true;

    this.totalSecond = 300; // 5 minutes
    this.remainMinute = Math.floor(this.totalSecond / 60);
    const timer$ = interval(1000).pipe(
      tap(() => {
        this.totalSecond -= 1;
        this.remainMinute = Math.floor(this.totalSecond / 60);
        if (this.totalSecond <= 0) {

          timer$.unsubscribe();
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

  success() {
    this.wxpayReady = false;
    this.dialogRef.close(this.order);
  }

}
