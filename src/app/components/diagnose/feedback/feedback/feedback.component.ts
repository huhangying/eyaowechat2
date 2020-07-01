import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Doctor } from 'src/app/models/doctor.model';
import { MatDialog } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/services/core.service';
import { AddFeedbackComponent } from '../add-feedback/add-feedback.component';
import { Observable } from 'rxjs';
import { UserFeedback } from 'src/app/models/user-feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { User } from 'src/app/models/user.model';

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
    this.feedbacks$ = this.feedbackServcie.getFeedbackHistoryByDoctorAndType(this.type, this.user._id, this.doctor._id);
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
        userid: this.user._id,
        type: this.type
      }
    }).afterClosed()
      .subscribe(() => {
        this.hideBtns = false;
        this.core.setTitle(currentTitle);
      });
  }

}
