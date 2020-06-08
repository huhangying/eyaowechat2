import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { LocalDatePipe } from './pipe/local-date.pipe';
import { GenderPipe } from './pipe/gender.pipe';
import { SelectDoctorsComponent } from './component/select-doctors/select-doctors.component';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';

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
    MatListModule,
    MatExpansionModule,
    MatTabsModule,
    MatDialogModule,
  ],
  exports: [
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatTabsModule,
    MatDialogModule,

    LocalDatePipe,
    GenderPipe,
    SelectDoctorsComponent,

  ],
  providers: [
    Title
  ]
})
export class CoreModule { }
