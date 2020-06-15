import { Component, OnInit, Input } from '@angular/core';
import { Doctor } from 'src/app/models/doctor.model';
import { MatDialog } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/services/core.service';
import { AddFeedbackComponent } from '../add-feedback/add-feedback.component';
import { Observable } from 'rxjs';
import { UserFeedback } from 'src/app/models/user-feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  @Input() type: number;
  @Input() doctor: Doctor;
  @Input() userid: string;
  hideAddBtn = false;
  feedbacks$: Observable<UserFeedback[]>;
  
  constructor(
    public dialog: MatDialog,
    private core: CoreService,
    private feedbackServcie: FeedbackService,
  ) { }

  ngOnInit(): void {
    this.feedbacks$ = this.feedbackServcie.getFeedbacksByType(this.type, this.userid);
  }

  add() {
    const currentTitle = this.core.getTitle();
    this.hideAddBtn = true;
    this.dialog.open(AddFeedbackComponent, {
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: {
        doctor: this.doctor,
        userid: this.userid,
        type: this.type
      }
    }).afterClosed()
      .subscribe(() => {
        this.hideAddBtn = false;
        this.core.setTitle(currentTitle);
      });
  }

}
