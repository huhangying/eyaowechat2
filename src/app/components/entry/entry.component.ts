import { Component, OnInit } from '@angular/core';
import weui from 'weui.js';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  nav(target: string) {
    this.router.navigate([target], { queryParams: this.route.snapshot.queryParams });
  }

}
