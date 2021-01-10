import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/core/services/core.service';
import { Faq } from 'src/app/models/public.model';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  faqs: Faq[];

  constructor(
    private route: ActivatedRoute,
    private core: CoreService,
    private publicService: PublicService,
  ) {
  }

  ngOnInit(): void {
    this.core.setTitle('常见问题');

    const hid = this.route.snapshot.queryParams?.state || '';
    if (hid) {
      this.publicService.getFaqs(+hid).subscribe(results => {
        this.faqs = results || [];
      })
    }
  }

}
