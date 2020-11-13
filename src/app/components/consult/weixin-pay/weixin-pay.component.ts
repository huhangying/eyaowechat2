import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, Optional, SkipSelf } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { interval } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';
import { MessageService } from 'src/app/core/services/message.service';
import { Doctor } from 'src/app/models/doctor.model';
import { User } from 'src/app/models/user.model';
import { WeixinPayResponse } from 'src/app/models/weixin-pay-response.model';
import { WeixinService } from 'src/app/services/weixin.service';
import { OrderService } from 'src/app/services/order.service';
import wx from 'weixin-js-sdk';

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
    this.orderId = `ORD${data.type}${this.orderStartTime}${Math.floor(Math.random() * 1000000)}`;
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('100%', '100%');
    this.core.setTitle('微信支付');

    this.wxService.unifiedOrder(this.data.user.link_id, this.orderId, this.data.amount, 'consult service ... for ' + this.orderId).pipe(
      tap((result: WeixinPayResponse) => {
        if (result?.result_code !== 'SUCCESS') {
          this.message.error(result.err_code + ': ' + result.err_code_des);
          return;
        } else {
          const timestamp = Math.floor(new Date().getTime() / 1000) + '';

          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: result.appid, // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: result.nonce_str, // 必填，生成签名的随机串
            signature: result.sign,// 必填，签名
            jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
          });

          wx.ready((w) => {
            // test, move to success() later
            this.startCountdownTimer();
            // save to transaction table
            this.orderService.update({
              openid: this.data.user.link_id,
              doctor: this.data.doctor._id,
              orderId: this.orderId,
              userName: this.data.user.name,
              doctorName: this.data.doctor.name,
              consultType: this.data.type,
              amount: this.data.amount,

              prepay_id: result.prepay_id,
              status: result.result_code,
              startTime: this.orderStartTime,
            }).subscribe();

            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            wx.chooseWXPay({
              timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: result.nonce_str, // 支付签名随机串，不长于 32 位
              package: 'prepay_id=' + result.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: result.sign, // 支付签名
              success: (res) => {
                // 支付成功后的回调函数
                console.log('===>', res);
                // save to transaction table
                this.orderService.update({
                  openid: this.data.user.link_id,
                  doctor: this.data.doctor._id,
                  orderId: this.orderId,
                  userName: this.data.user.name,
                  doctorName: this.data.doctor.name,
                  consultType: this.data.type,
                  amount: this.data.amount,

                  prepay_id: result.prepay_id,
                  status: result.result_code, // res.
                  startTime: this.orderStartTime,
                }).subscribe();


                if (res.err_msg == "get_brand_wcpay_request:ok") {
                  // 使用以上方式判断前端返回,微信团队郑重提示：
                  //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。

                }
              }
            });

          });
          wx.error(function (res) {
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            // 更新签名
            // weui.alert('Error:' + JSON.stringify(res));
          });

        }
      })
    ).subscribe();
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
    this.dialogRef.close(true);
  }

}
