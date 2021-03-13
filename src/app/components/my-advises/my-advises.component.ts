import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';
import { Advise } from 'src/app/models/survey/advise.model';
import { User } from 'src/app/models/user.model';
import { AdviseService } from 'src/app/services/advise.service';
import { MyAdviseComponent } from './my-advise/my-advise.component';

@Component({
  selector: 'app-my-advises',
  templateUrl: './my-advises.component.html',
  styleUrls: ['./my-advises.component.scss']
})
export class MyAdvisesComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  user: User;
  advises$: Observable<Advise[]>;
  historyLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    public dialog: MatDialog,
    private adviseService: AdviseService,
  ) { 
    this.route.data.pipe(
      distinctUntilChanged(),
      tap(data => {
        this.user = data.user;
        if (this.user?._id) {
          this.loadAdvises(this.user._id);
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.core.setTitle('线下咨询历史记录');
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  loadAdvises(userid: string) {
    if (userid) {
      this.advises$ = this.adviseService.geUserAdviseHistory(this.user._id);
      this.historyLoaded = true;
    }
  }

  goDetails(advise: Advise) {
    this.dialog.open(MyAdviseComponent, {
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: {
        advise: advise,
      }
    }).afterClosed().subscribe(() => {
      this.core.setTitle('线下咨询历史记录');
      if (!this.historyLoaded && this.user?._id) {
        this.loadAdvises(this.user._id);
      }
    });
  }

}
