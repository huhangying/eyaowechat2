import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';
import { SocketioService } from 'src/app/core/services/soketio.service';
import { AppStoreService } from 'src/app/core/store/app-store.service';
import { Consult } from 'src/app/models/consult/consult.model';
import { Doctor } from 'src/app/models/doctor.model';
import { User } from 'src/app/models/user.model';
import { ConsultService } from 'src/app/services/consult.service';
import { WeixinService } from 'src/app/services/weixin.service';
import *  as qqface from 'wx-qqface';

@Component({
  selector: 'app-consult-reply',
  templateUrl: './consult-reply.component.html',
  styleUrls: ['./consult-reply.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultReplyComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  room: string;
  consults: Consult[];
  consultId: string;
  doctor: Doctor;
  user: User;
  isUnfinishedConsult: boolean;

  openid: string;
  state: number;
  isRejected: boolean;

  myInput = '';
  showEmoji = false;
  qqfaces: string[] = qqface.codeMap;

  constructor(
    private core: CoreService,
    private route: ActivatedRoute,
    private router: Router,
    private appStore: AppStoreService,
    private consultService: ConsultService,
    private wxService: WeixinService,
    private cd: ChangeDetectorRef,
    private socketio: SocketioService,
  ) {
    this.route.queryParams.pipe(
      tap(params => {
        this.consultId = params.id;
        this.openid = params.openid;
        this.state = params.state;
        this.isRejected = !!params.reject;
      })
    ).subscribe();

    this.route.data.pipe(
      tap(data => {
        this.user = data.user;
        this.doctor = data.doctor;
      }),
    ).subscribe();
    
    this.socketio.setupSocketConnection();
  }

  ngOnInit(): void {
    this.consultService.getAllConsultsByGroup(this.consultId).pipe(
      tap(results => {
        this.consults = results;
        if (results?.length) {
          // check if consult finished or not.
          const consult = results.find(_ => _._id === this.consultId && !_.parent);              
          this.isUnfinishedConsult = consult ? !consult.finished : false;
          this.cd.markForCheck();
          this.scrollTo(this.consultId);
        }
        let title = !this.isRejected ? '药师咨询回复' : '药师不能完成咨询';
        if (!this.isUnfinishedConsult) {
          title += ' (已完成)'
        }
        this.core.setTitle(title);
      })
    ).subscribe();

    this.room = this.doctor?._id;
    this.socketio.joinRoom(this.room);

    this.socketio.onConsult((msg: Consult) => {
      // filter by the doctor and pid
      if (msg.doctor === this.doctor._id && msg.user === this.user._id) {
        this.consults.push(msg);
        this.scrollBottom();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    // this.socketio.leaveRoom(this.room);
  }

  scrollTo(consultid: string) {
    this.cd.markForCheck();
    setTimeout(() => {
      document.getElementById(consultid)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      this.cd.markForCheck();
    }, 200);
  }

  back() {
    this.wxService.closeWindow();
  }

  goChat() {
    this.router.navigate(['/chat'], {
      queryParams: {
        doctorid: this.doctor._id,
        openid: this.appStore.token?.openid || this.openid,
        state: this.appStore.hid || this.state,
      }
    });
  }


  ////////////////////////////////////////////////////
  send(imgPath?: string) {
    this.showEmoji = false;
    let consultMsg: Consult;
    // if (imgPath) {
    //   // Picture
    //   chatMsg = {
    //     room: this.room,
    //     sender: this.user._id,
    //     senderName: this.user.name,
    //     to: this.doctor._id,
    //     type: ChatType.picture,
    //     data: imgPath,
    //     cs: this.isCs
    //   };
    // } else {
    //   // Text
      if (this.myInput.trim() === '') return; // avoid sending empty
      consultMsg = {
        parent: this.consultId,
        user: this.user._id,
        doctor: this.doctor._id,
        userName: this.user.name,
        content: this.myInput,
        type: 0, // 图文咨询
        status: 0,
      };
    // }
    this.consults.push({...consultMsg, createdAt: new Date()});

    
    this.consultService.AddConsult(consultMsg).pipe(
      tap((result: Consult) => {
        if (result?._id) {
          this.socketio.sendConsult(this.doctor._id, result);
        }
      })
    ).subscribe();
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

  scrollBottom() {
    this.cd.markForCheck();
    setTimeout(() => {
      const footer = document.getElementById('_bottom');
      footer?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      this.cd.markForCheck();
    }, 200);
  }

}
