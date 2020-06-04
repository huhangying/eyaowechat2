import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { LocalDatePipe } from './pipe/local-date.pipe';
import { GenderPipe } from './pipe/gender.pipe';



@NgModule({
  declarations: [
    LocalDatePipe,
    GenderPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    LocalDatePipe,
    GenderPipe,
  ],
  providers: [
    Title
  ]
})
export class CoreModule { }
