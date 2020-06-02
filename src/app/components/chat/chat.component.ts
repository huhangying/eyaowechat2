import { Component, OnInit } from '@angular/core';
// import 'weui';
import weui from 'weui.js';
import { AppStoreService } from '../../core/store/app-store.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(
    private appStore: AppStoreService,
  ) { }

  ngOnInit(): void {
    weui.alert(this.appStore.token);
  }
  
  test() {
    weui.alert('ddd');
  }

}
