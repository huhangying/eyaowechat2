import { Component, Input, OnInit } from '@angular/core';
import *  as qqface from 'wx-qqface';
import { Consult } from '../../../models/consult/consult.model';

@Component({
  selector: 'app-consult-request-content',
  templateUrl: './consult-request-content.component.html',
  styleUrls: ['./consult-request-content.component.scss']
})
export class ConsultRequestContentComponent implements OnInit {
  @Input() consult: Consult;

  constructor() { }

  ngOnInit(): void {
  }

  translateEmoji(text: string) {
    const reg = new RegExp(('\\/:(' + qqface.textMap.join('|') + ')'), 'g');// ie. /:微笑
    return text.replace(reg, (name) => {
      const code = qqface.textMap.indexOf(name.substr(2)) + 1;
      return code ? '<img src="assets/qqface/' + code + '.gif" />' : '';
    });
  }

}
