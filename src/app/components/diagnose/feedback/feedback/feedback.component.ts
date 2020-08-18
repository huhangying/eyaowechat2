import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Doctor } from 'src/app/models/doctor.model';
import { MatDialog } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/services/core.service';
import { AddFeedbackComponent } from '../add-feedback/add-feedback.component';
import { Observable, Subject } from 'rxjs';
import { UserFeedback } from 'src/app/models/user-feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { User } from 'src/app/models/user.model';
import *  as qqface from 'wx-qqface';
import { tap, takeUntil } from 'rxjs/operators';
import { SocketioService } from 'src/app/core/services/soketio.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit, OnDestroy {
  @Input() type: number;
  @Input() doctor: Doctor;
  @Input() user: User;
  @Output() close = new EventEmitter();
  destroy$ = new Subject<void>();
  hideBtns = false;
  feedbacks$: Observable<UserFeedback[]>;
  feedbacks: UserFeedback[];
  room: string;

  constructor(
    public dialog: MatDialog,
    private core: CoreService,
    private socketio: SocketioService,
    private feedbackServcie: FeedbackService,
  ) {
    this.socketio.setupSocketConnection();

    this.socketio.onFeedback((msg) => {
      this.feedbacks.push(msg);
      this.scrollBottom();
    });
  }

  ngOnInit(): void {
    this.feedbackServcie.getFeedbackHistoryByDoctorAndType(this.type, this.user._id, this.doctor._id).pipe(
      tap((results) => {
        this.feedbacks = results;
        this.scrollBottom();
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this.room = this.doctor?._id;
    this.socketio.joinRoom(this.room);
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.socketio.leaveRoom(this.room);
  }

  back() {
    this.close.emit();
  }

  add() {
    const currentTitle = this.core.getTitle();
    this.hideBtns = true;
    this.dialog.open(AddFeedbackComponent, {
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: {
        doctor: this.doctor,
        user: this.user,
        type: this.type
      }
    }).afterClosed()
      .subscribe((result) => {
        this.hideBtns = false;
        this.core.setTitle(currentTitle);
        if (result?._id) { // add successfully
          this.feedbacks.push(result);
          this.socketio.sendFeedback(this.room, result);
          this.scrollBottom();
        }
      });
  }

  scrollBottom() {
    setTimeout(() => {
      const footer = document.getElementById('_bottom');
      footer?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }

  translateEmoji(text: string) {
    const reg = new RegExp(('\\/:(' + qqface.textMap.join('|') + ')'), 'g');// ie. /:微笑
    return text.replace(reg, (name) => {
      const code = qqface.textMap.indexOf(name.substr(2)) + 1;
      return code ? '<img src="assets/qqface/' + code + '.gif" />' : '';
    });
  }

}
