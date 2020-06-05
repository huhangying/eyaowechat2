import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { LocalDatePipe } from './pipe/local-date.pipe';
import { GenderPipe } from './pipe/gender.pipe';
import { SelectDoctorsComponent } from './component/select-doctors/select-doctors.component';



@NgModule({
  declarations: [
    LocalDatePipe,
    GenderPipe,
    SelectDoctorsComponent,

  ],
  imports: [
    CommonModule,
  ],
  exports: [
    LocalDatePipe,
    GenderPipe,
    SelectDoctorsComponent,

  ],
  providers: [
    Title
  ]
})
export class CoreModule { }
