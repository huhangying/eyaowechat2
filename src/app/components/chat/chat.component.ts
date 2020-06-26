import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import weui from 'weui.js';
import wx from 'weixin-js-sdk';
import { AppStoreService } from '../../core/store/app-store.service';
import { tap, catchError, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import { WeixinService } from 'src/app/services/weixin.service';
import { Chat, ChatType } from 'src/app/models/chat.model';
import { Doctor } from 'src/app/models/doctor.model';
import { SocketioService } from 'src/app/core/services/soketio.service';
import { User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { CoreService } from 'src/app/core/services/core.service';
import { ActivatedRoute } from '@angular/router';
import *  as qqface from 'wx-qqface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  room: string;
  doctor: Doctor;
  user: User;
  chats: Chat[];
  myInput = '';
  errorMessage: string;
  returnMessage: string;
  showEmoji = false;
  qqfaces: string[] = qqface.codeMap;

  constructor(
    private route: ActivatedRoute,
    private appStore: AppStoreService,
    private wxService: WeixinService,
    private socketio: SocketioService,
    private cd: ChangeDetectorRef,
    private chat: ChatService,
    private core: CoreService,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        this.doctor = data.doctor;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
    this.socketio.setupSocketConnection();
  }

  async ngOnInit() {
    this.core.setTitle(this.doctor.name);

    this.room = this.doctor?._id;
    this.socketio.joinRoom(this.room);

    this.socketio.onRoom(this.room, (msg) => {
      this.chats.push(msg);
      this.scrollBottom();
    });

    this.socketio.onChat((msg) => {
      this.chats.push(msg);
      this.scrollBottom();
    });


    // get chat history
    this.chat.getChatHistory(this.user._id, this.doctor._id).pipe(
      tap((results: Chat[]) => {
        if (results?.length) {
          this.chats = results.sort((a, b) => (+new Date(a.created) - +new Date(b.created)));
          this.scrollBottom();
        } else {
          this.chats = [];
        }
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.socketio.leaveRoom(this.room);
  }

  scrollBottom() {
    this.cd.markForCheck();
    setTimeout(() => {
      const footer = document.getElementById('chat-bottom');
      footer.scrollIntoView({ behavior: 'smooth', block: 'end' });
      this.cd.markForCheck();
    });
  }

  buildWechatObj() {
    this.wxService.getSignature(this.appStore.token.openid).pipe(
      // this.wxService.getSignatureByUrl(location.href.split('#')[0]).pipe(
      tap(result => {
        if (result) {
          this.returnMessage = JSON.stringify(result);
          this.cd.markForCheck();

          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: result.appid, // 必填，公众号的唯一标识
            timestamp: result.timestamp, // 必填，生成签名的时间戳
            nonceStr: result.nonce, // 必填，生成签名的随机串
            signature: result.signature,// 必填，签名
            jsApiList: ['checkJsApi'] // 必填，需要使用的JS接口列表
          });
          wx.ready((w) => {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            weui.alert('Ready:' + JSON.stringify(w));
          });
          wx.error(function (res) {
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            // 更新签名
            // weui.alert('Error:' + JSON.stringify(res));
          });
        }
      }),
      catchError(err => {
        this.errorMessage = JSON.stringify(err);
        this.cd.markForCheck();
        return EMPTY;
      })
    ).subscribe();
  }

  send() {
    this.showEmoji = false;
    if (this.myInput.trim() === '') return; // avoid sending empty
    const chatMsg = {
      room: this.room,
      sender: this.user._id,
      senderName: this.user.name,
      to: this.doctor._id,
      type: ChatType.text,
      data: this.myInput
    };
    this.chats.push(chatMsg);

    this.socketio.sendChat(this.room, chatMsg);
    this.chat.sendChat(chatMsg).subscribe();
    this.scrollBottom();
    this.myInput = '';
  }

  toggleEmoji() {
    this.showEmoji = !this.showEmoji;
    this.scrollBottom();
  }

  addEmoji(code: number) {
    const emoji = '/:' + qqface.codeToText(code) + ' ';
    this.myInput = this.myInput + emoji;
  }

  translateEmoji(text: string) {
    const reg = new RegExp(('\\/:(' + qqface.textMap.join('|') + ')'), 'g');// ie. /:微笑
    return text.replace(reg, (name) => {
      const code = qqface.textMap.indexOf(name.substr(2)) + 1;
      return code ? '<img src="assets/qqface/' + code + '.gif" />' : '';
    });
  }

}
