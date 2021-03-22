import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
// import weui from 'weui.js';
// import wx from 'weixin-js-sdk';
import { AppStoreService } from '../../core/store/app-store.service';
import { tap, catchError, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import { Chat, ChatCommandType, ChatCommandTypeMap, ChatType } from 'src/app/models/chat.model';
import { Doctor } from 'src/app/models/doctor.model';
import { SocketioService } from 'src/app/core/services/soketio.service';
import { User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { CoreService } from 'src/app/core/services/core.service';
import { ActivatedRoute, Router } from '@angular/router';
import *  as qqface from 'wx-qqface';
import { UploadService } from 'src/app/core/services/upload.service';
import { ConsultService } from 'src/app/services/consult.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { Consult } from 'src/app/models/consult/consult.model';

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
  isCs: boolean;
  consult: Consult;
  setCharged: boolean; // 药师设置收费flag

  chats: Chat[];
  myInput = '';
  showEmoji = false;
  qqfaces: string[] = qqface.codeMap;
  dataType = ChatType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appStore: AppStoreService,
    private socketio: SocketioService,
    private cd: ChangeDetectorRef,
    private chat: ChatService,
    private core: CoreService,
    private uploadService: UploadService,
    private doctorService: DoctorService,
    private consultService: ConsultService,
  ) {
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        this.doctor = data.doctor;
        this.isCs = !!route.snapshot.queryParams.cs; // 是否是客服药师
        if (this.isCs) {
          this.doctor.icon = this.doctorService.getCsDoctorIcon(this.doctor.gender);
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
    this.socketio.setupSocketConnection();
  }

  async ngOnInit() {
    if (this.isCs) {
      this.core.setTitle('药师客服咨询');
    } else {
      this.core.setTitle(this.doctor.name + this.doctor.title + '在线咨询');
    }

    this.room = this.doctor?._id;
    this.socketio.joinRoom(this.room);

    this.socketio.onChat((msg: Chat) => {
      // filter by the doctor and pid
      if (msg.sender === this.room && msg.sender === this.doctor._id && msg.to === this.user._id) {
        this.checkCommand(msg);
        this.chats.push(msg);
        this.scrollBottom();
      }
    });

    // get chat history
    const chatHistory$ = this.isCs ?
      this.chat.getCsChatHistoryByPatient(this.user._id) :
      this.chat.getChatHistory(this.user._id, this.doctor._id);
    chatHistory$.pipe(
      tap((results: Chat[]) => {
        if (results?.length) {
          this.chats = results.sort((a, b) => (+new Date(a.created) - +new Date(b.created)));
          this.scrollBottom();
        } else {
          this.chats = [];
        }
      })
    ).subscribe();

    if (!this.isCs && this.doctor.prices?.length) {
      // get 付费咨询 flag
      this.consultService.getPendingConsultByDoctorIdAndUserId(this.doctor._id, this.user._id).pipe(
        tap(result => {
          this.consult = result;
          this.setCharged = this.consult?.setCharged;
          this.cd.markForCheck();
          // 
          if (this.existsConsult) {
            this.simulateInConsultMsg();
          }
        }),
        takeUntil(this.destroy$),
      ).subscribe();
    }
  }
  
  //是否付费咨询中
  get existsConsult() { return this.consult?.setCharged && !!this.consult.out_trade_no; }

  // setConsultCharged(value: boolean) {
  //   this.setCharged = this.consult?.setCharged;
  //   this.cd.markForCheck();
  // }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    // this.socketio.leaveRoom(this.room);
  }

  scrollBottom() {
    this.cd.markForCheck();
    setTimeout(() => {
      const footer = document.getElementById('_bottom');
      footer?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      this.cd.markForCheck();
    }, 200);
  }

  send(imgPath?: string) {
    this.showEmoji = false;
    let chatMsg;
    if (imgPath) {
      // Picture
      chatMsg = {
        room: this.room,
        sender: this.user._id,
        senderName: this.user.name,
        to: this.doctor._id,
        type: ChatType.picture,
        data: imgPath,
        cs: this.isCs
      };
    } else {
      // Text
      if (this.myInput.trim() === '') return; // avoid sending empty
      chatMsg = {
        room: this.room,
        sender: this.user._id,
        senderName: this.user.name,
        to: this.doctor._id,
        type: ChatType.text,
        data: this.myInput,
        cs: this.isCs
      };
    }
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

  translateCommand(cmd: ChatCommandType) {
    return ChatCommandTypeMap[cmd];
  }

  // 模拟发送‘付费咨询中’消息
  simulateInConsultMsg() {
    this.chats.push({
      room: this.room,
      sender: this.doctor._id,
      senderName: this.doctor.name,
      to: this.user._id,
      type: ChatType.command,
      data: ChatCommandType.inConsult
    });
    this.scrollBottom();
  }

  imageUpload(event) {
    if (event.target.files?.length) {
      const [file] = event.target.files;
      const newfileName = `.${file.name.split('.').pop()}`; // _id.[ext]

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {

        const newFile = await this.uploadService.compressImg(file);
        this.uploadService.uploadUserDir(this.user._id, 'chat', newFile, newfileName).pipe(
          tap((result: { path: string }) => {
            if (result?.path) {
              this.send(result.path);
            }
          })
        ).subscribe();
      };
    }
  }

  //========================== 
  goConsult(type: number) {
    this.router.navigate(['/consult'], {
      queryParams: {
        doctorid: this.doctor._id,
        openid: this.appStore.token?.openid || this.route.snapshot.queryParams?.openid,
        state: this.appStore.hid || this.route.snapshot.queryParams?.state,
        type
      }
    });
  }

  // 回到付费咨询
  goBackConsult() {
    this.router.navigate(['/consult-reply'], {
      queryParams: {
        doctorid: this.doctor._id,
        openid: this.appStore.token?.openid || this.route.snapshot.queryParams?.openid,
        state: this.appStore.hid || this.route.snapshot.queryParams?.state,
        type: this.consult.type,
        id: this.consult._id,
      }
    });
  }


  checkConsultServiceExist(type: number) {
    return this.doctor.prices?.findIndex(_ => _.type === type) > -1;
  }

  checkCommand(msg: Chat) {
    if (msg.type === ChatType.command) {
      // charged ? ChatCommandType.setCharged : ChatCommandType.setFree;
      this.setCharged = ChatCommandType.setCharged === msg.data;
      this.cd.markForCheck();
    }
  }

}
