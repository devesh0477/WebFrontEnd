import { Component, OnInit } from '@angular/core';

declare var LiveAgent: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  date: Date = new Date();
  constructor() { }

  ngOnInit() {
    this.liveChatScript();
  }

  liveChatScript = () => {
    {
      let scriptUrl = 'https://letsgostudy.ladesk.com/scripts/track.js';
      let node = document.createElement('script');
      node.src = scriptUrl;
      node.id = 'la_x2s6df8d';
      node.type = 'text/javascript';
      node.async = true;
      node.charset = 'utf-8';
      node.onload = function (e) {
        LiveAgent.createButton('v207oygz', document.getElementById("chatButton"));
      };
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }

}
