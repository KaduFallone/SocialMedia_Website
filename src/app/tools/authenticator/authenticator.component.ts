import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent implements OnInit {

  state = AuthenticatorCompState.LOGIN;

  constructor() { }

  ngOnInit(): void {
  }

  onForgotPasswordClick(){
    this.state = AuthenticatorCompState.FORGOT_PASSWORD;
   }

  onCreateAcountClick(){
    this.state = AuthenticatorCompState.REGISTER;

  }

  onLoginClick(){
    this.state = AuthenticatorCompState.LOGIN;

  }

  isLoginState(){
    return this.state == AuthenticatorCompState.LOGIN;
  }

  isRegisterState(){
    return this.state == AuthenticatorCompState.REGISTER;
  }

  isForgotPasswordState(){
    return this.state == AuthenticatorCompState.FORGOT_PASSWORD;
  }

  getStateText(){
    switch(this.state){
      case AuthenticatorCompState.LOGIN:
        return "LOGIN"
      
      case AuthenticatorCompState.REGISTER:
        return "REGISTRAR"

      case AuthenticatorCompState.FORGOT_PASSWORD:
        return "RECUPERAR SENHA"
    }
  }

}

export enum AuthenticatorCompState{
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}