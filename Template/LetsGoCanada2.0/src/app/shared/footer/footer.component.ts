import { Component, OnInit } from '@angular/core';

declare var LiveAgent: any;

@Component({
    selector: 'app-footer-cmp',
    templateUrl: 'footer.component.html'
})

export class FooterComponent implements OnInit {
    test: Date = new Date();

    ngOnInit() {
        var session: any = JSON.parse(localStorage.getItem('session'));
        if (session.role == 4 || session.role == 5) {
            return;
        } else
            this.liveChatScript();

        // console.log('localStorage.getItem(session).role', session.role)
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
