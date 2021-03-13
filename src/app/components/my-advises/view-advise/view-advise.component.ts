import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';
import { Advise } from 'src/app/models/survey/advise.model';
import { AdviseService } from 'src/app/services/advise.service';

@Component({
  selector: 'app-view-advise',
  templateUrl: './view-advise.component.html',
  styleUrls: ['./view-advise.component.scss']
})
export class ViewAdviseComponent implements OnInit {
  advise: Advise;
  
  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    private adviseService: AdviseService,
  ) { 
    const id = this.route.snapshot.queryParams?.id || '';
    if (id) {
      this.adviseService.geAdvise(id).pipe(
        tap(result => {
          this.advise = result;
        })
      ).subscribe();
    }
  }

  ngOnInit(): void {
    this.core.setTitle('线下咨询记录');
  }

}
