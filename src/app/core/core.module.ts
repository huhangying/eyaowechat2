import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { LocalDatePipe } from './pipe/local-date.pipe';
import { GenderPipe } from './pipe/gender.pipe';
import { SelectDoctorsComponent } from './component/select-doctors/select-doctors.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ImgPathPipe } from './pipe/img-path.pipe';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ImgClickViewDirective } from './directive/img-click-view.directive';
import { ImageComponent } from './component/image/image.component';

@NgModule({
  declarations: [
    LocalDatePipe,
    GenderPipe,
    SelectDoctorsComponent,
    ImgPathPipe,
    ImgClickViewDirective,
    ImageComponent,

  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatTabsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSnackBarModule,
  ],
  exports: [
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatTabsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSnackBarModule,

    LocalDatePipe,
    GenderPipe,
    ImgPathPipe,
    SelectDoctorsComponent,
    ImgClickViewDirective,
  ],
  providers: [
    Title,
    MatDatepickerModule,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' },
  ]
})
export class CoreModule { }
