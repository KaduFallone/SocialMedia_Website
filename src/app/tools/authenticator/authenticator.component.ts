import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent implements OnInit {

  state = AuthenticatorCompState.LOGIN;

  firebaseTsAuth: FirebaseTSAuth;

  constructor(private bottomSheet: MatBottomSheetRef) {

    this.firebaseTsAuth = new FirebaseTSAuth();
   }

  ngOnInit(): void {
  }

  onResetClick(resetEmail: HTMLInputElement){
    let email = resetEmail.value;
    if(this.isNotEmpty(email)){
      this.firebaseTsAuth.sendPasswordResetEmail(
        {
          email: email,
          onComplete: (err) => {
            this.bottomSheet.dismiss();
          }
        }
      );
    }
  }

  onLogin(
    loginEmail:HTMLInputElement ,
    loginPassword:HTMLInputElement 
  ){
    let email = loginEmail.value;
    let password = loginPassword.value;

    if(this.isNotEmpty(email) &&
        this.isNotEmpty(password)
    ){
      this.firebaseTsAuth.signInWith(
        {
          email: email,
          password: password,
          onComplete: (uc) => {
            this.bottomSheet.dismiss();
          },
          onFail: (err) =>{
            console.error(err);
            alert("Falha no login: " + err);
          }
        }
      )
    }

  }

  onRegisterClick(
    registerEmail: HTMLInputElement,
    registerPassword:HTMLInputElement,
    registerConfirmPassword:HTMLInputElement
  ){
    let email = registerEmail.value;
    let password = registerPassword.value;
    let confirmPassword = registerConfirmPassword.value;


    if(
      this.isNotEmpty(email) &&
      this.isNotEmpty(password) &&
      this.isNotEmpty(confirmPassword) &&
      this.isAMatch(password, confirmPassword)
    ){
      this.firebaseTsAuth.createAccountWith(
        {
          email: email,
          password: password,
          onComplete: (uc) => {
            this.bottomSheet.dismiss();
          },
          onFail: (err) => {
            console.error(err);
            alert("Falha ao criar conta: " + err);
          }
        }
      );
    }
  };
    

  isNotEmpty(text: string){
    return text != null && text.length > 0; 
  }

  isAMatch(text:string, comparedWith: string){
    return text == comparedWith;
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