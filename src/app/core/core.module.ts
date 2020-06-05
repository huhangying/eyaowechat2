import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { LocalDatePipe } from './pipe/local-date.pipe';
import { GenderPipe } from './pipe/gender.pipe';
import { SelectDoctorsComponent } from './component/select-doctors/select-doctors.component';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    LocalDatePipe,
    GenderPipe,
    SelectDoctorsComponent,

  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    MatIconModule,
    MatButtonModule,

    LocalDatePipe,
    GenderPipe,
    SelectDoctorsComponent,

  ],
  providers: [
    Title
  ]
})
export class CoreModule { }
