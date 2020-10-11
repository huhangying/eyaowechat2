import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import 'hammerjs';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent implements OnInit {
  winHeight = window.innerHeight;
  imgWidth = window.innerWidth;
  maxWidth = window.innerWidth * 3;
  minWidth = window.innerWidth / 2;

  marginLeft = 0;
  marginTop = 0;
  scale = 1;

  constructor(
    public dialogRef: MatDialogRef<ImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      imgPath: string;
    },
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  // mouseWheelUpFunc() {
  //   if (this.imgWidth < this.maxWidth) {
  //     this.imgWidth = this.imgWidth + 10;
  //   }
  //   // console.log('mouse wheel up, image width', this.imgWidth);
  // }

  // mouseWheelDownFunc() {
  //   if (this.imgWidth > this.minWidth) {
  //     this.imgWidth = this.imgWidth - 10;
  //   }
  //   // console.log('mouse wheel down, image width', this.imgWidth);
  // }

  onPanLeft(event) {
    if (this.scale <= 1) return;

    if (event.isFinal) {
      const imgWidth = this.imgWidth * this.scale;
      if (imgWidth + this.marginLeft + event.deltaX > window.innerWidth) {
        this.marginLeft += event.deltaX;
      } else {
        this.marginLeft = window.innerWidth - imgWidth;
      }
      this.cd.markForCheck();
      // console.log('pan left', event);
    }
  }

  onPanRight(event) {
    if (this.scale <= 1) return;

    if (event.isFinal) {
      const imgWidth = this.imgWidth * this.scale;
      if (imgWidth - window.innerWidth > (this.marginLeft + event.deltaX)) {
        this.marginLeft += event.deltaX;
      } else {
        this.marginLeft = (imgWidth - window.innerWidth);
      }
      // console.log('pan right', event);
      this.cd.markForCheck();
    }
  }

  onPanUp(event) {
    if (this.scale <= 1) return;

    if (event.isFinal) {
      if (this.marginTop + event.deltaY > -window.innerHeight / 2) {
        this.marginTop += event.deltaY;
      } else {
        this.marginTop = -window.innerHeight / 2;
      }
      // console.log('pan up', event);
      this.cd.markForCheck();
    }
  }

  onPanDown(event) {
    if (this.scale <= 1) return;

    if (event.isFinal) {
      if (this.marginTop + event.deltaY < window.innerHeight / 2) {
        this.marginTop += event.deltaY;
      } else {
        this.marginTop = window.innerHeight / 2;
      }
      // console.log('pan down', event);
      this.cd.markForCheck();
    }
  }

  zoomin() {
    if (this.scale < 3) {
      this.scale *= 1.25;
      this.cd.markForCheck();
    }
  }

  zoomout() {
    if (this.scale > 0.5) {
      this.scale *= 0.8;
      this.cd.markForCheck();
    }
  }

}
