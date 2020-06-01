import { Component, OnInit } from '@angular/core';
// import 'weui';
import weui from 'weui.js';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  test() {
    weui.alert('ddd');
  }

}
