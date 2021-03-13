import { Component, Inject, OnInit, Optional, SkipSelf } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/services/core.service';
import { Advise } from 'src/app/models/survey/advise.model';

@Component({
  selector: 'app-my-advise',
  templateUrl: './my-advise.component.html',
  styleUrls: ['./my-advise.component.scss']
})
export class MyAdviseComponent implements OnInit {
  advise: Advise;

  constructor(
    private core: CoreService,
    public dialogRef: MatDialogRef<MyAdviseComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() @SkipSelf() public data: {
      advise: Advise,
    },
  ) { 
    this.advise = data.advise;
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('100%', '100%');
  }

  close() {
    this.dialogRef.close();
  }

}
