import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageComponent } from '../component/image/image.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    public dialog: MatDialog,
  ) { }

  viewImage(imgPath: string, title?: string) {
    return this.dialog.open(ImageComponent, {
      // minWidth: '460px',
      minWidth: '100vw',
      data: {
        title: title,
        imgPath: imgPath
      }
    }).afterClosed();
  }
}
