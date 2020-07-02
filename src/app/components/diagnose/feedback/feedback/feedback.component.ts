import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Doctor } from 'src/app/models/doctor.model';
import { MatDialog } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/services/core.service';
import { AddFeedbackComponent } from '../add-feedback/add-feedback.component';
import { Observable } from 'rxjs';
import { UserFeedback } from 'src/app/models/user-feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { User } from 'src/app/models/user.model';
import *  as qqface from 'wx-qqface';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  @Input() type: number;
  @Input() doctor: Doctor;
  @Input() user: User;
  @Output() close = new EventEmitter();
  hideBtns = false;
  feedbacks$: Observable<UserFeedback[]>;
  
  constructor(
    public dialog: MatDialog,
    private core: CoreService,
    private feedbackServcie: FeedbackService,
  ) { }

  ngOnInit(): void {
    this.feedbacks$ = this.feedbackServcie.getFeedbackHistoryByDoctorAndType(this.type, this.user._id, this.doctor._id).pipe(
      tap(() => {
        this.scrollBottom();
      })
    );
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
      .subscribe(() => {
        this.hideBtns = false;
        this.core.setTitle(currentTitle);
      });
  }

  scrollBottom() {
    setTimeout(() => {
      const footer = document.getElementById('chat-bottom');
      footer.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
