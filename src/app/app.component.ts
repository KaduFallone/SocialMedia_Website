import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'social-media-site';

  constructor(private loginSheet: MatBottomSheet){}

  onGetStartedClick(){
    this.loginSheet.open(AuthenticatorComponent);
  }
}
