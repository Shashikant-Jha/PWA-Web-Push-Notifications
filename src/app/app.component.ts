import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app works!';
  constructor(private _http: Http) { 
       if ('serviceWorker' in navigator) {
      console.log('Service Worker is supported on this browser');
      navigator.serviceWorker.register('worker-basic.min.js').then(function () {
        return navigator.serviceWorker.ready;
      }).then(function (reg) {
        console.log('Service Worker is ready to go!', reg);
        reg.pushManager.subscribe(
          {
            userVisibleOnly: true
          }
        ).then(function (sub) {
          let sub1 = JSON.parse(JSON.stringify(sub));
          console.log(sub1);
          Cookie.set('endpoint', sub1.endpoint);
          Cookie.set('p256dh', sub1.keys.p256dh);
          Cookie.set('auth', sub1.keys.auth);
        });
      }).catch(function (error) {
        console.log('Service Worker failed to boot', error);
      });
    }
  }

  ngOnInit() { }

  register() {
    let data = {
      endpoint: Cookie.get('endpoint'),
      p256dh: Cookie.get('p256dh'),
      auth: Cookie.get('auth')
    };
    console.log(data);
    let _http: Http;
    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({ headers: headers });
    const body = JSON.stringify(data);
 
    this._http.post('http://localhost:5000/api/posting',body, {headers:headers})
   .subscribe(res => console.log(res));
   }

  generateNotifications() {
    let _http: Http;
    this._http.get('http://localhost:5000/api/notif')
   .subscribe(
     res => console.log(res),
     err => console.log(err)
   );
  }
}
