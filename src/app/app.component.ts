import { toPublicName } from '@angular/compiler/src/i18n/serializers/xmb';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth'; 
import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'social-media-site';
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userHasProfile = false;
  userDocument?: UserDocument;
  isLoggedIn = false;
  isCheckingProfile = true;

  constructor(
    private loginSheet: MatBottomSheet, 
    private router: Router,
    private zone: NgZone
  ) {
    this.auth.listenToSignInStateChanges(user => {
      this.auth.checkSignInState({
        whenSignedIn: user => {
          console.log("LOG: Usuário logado detectado.");
          this.verificarEredirecionar(user);
        },
        whenSignedOut: user => {
          this.zone.run(() => {
            console.log("LOG: Usuário deslogado. Limpando estados...");
            this.isLoggedIn = false;
            this.userHasProfile = false;
            this.userDocument = undefined;
            this.isCheckingProfile = false;
            this.router.navigate(["/"]);
          });
        },
        whenSignedInAndEmailNotVerified: user => {
          console.log("LOG: Email não verificado via firebasets.");
          this.verificarEredirecionar(user);
        },
        whenSignedInAndEmailVerified: user => {
          this.zone.run(() => {
            this.isLoggedIn = true;
            this.isCheckingProfile = true; 
            this.getUserProfile();
          });
        },
        whenChanged: user => {

        }
      });
    });
  }

  // Função auxiliar para garantir que a navegação funcione
  private verificarEredirecionar(user: any) {
    if (!user?.emailVerified) {
      console.log("LOG: Forçando navegação dentro da Zona do Angular...");
      this.zone.run(() => {
        this.router.navigate(["/emailVerification"]);
      });
    }
  }

  getUserProfile(){
    const user = this.auth.getAuth().currentUser;

    if(!user){
      this.zone.run(() =>{
        this.isCheckingProfile = false;
        this.isLoggedIn = false;
      });
      return;
    }

    this.isCheckingProfile = true;

    this.firestore.listenToDocument(
      {
        name: "Getting Document" ,
        path: ["Users", user.uid],
        onUpdate: (result) => {
          this.zone.run(() => { 
            this.userHasProfile = result.exists;
            console.log("LOG: Perfil existe? ", this.userHasProfile);
            this.userDocument = <UserDocument>result.data();
            this.isCheckingProfile = false;

            if(this.userHasProfile){
              console.log("LOG: Redirecionado para PostFeed...");
              this.router.navigate(["/postfeed"]);
            }
          });
        }
      }
    );
  }

  onLogoutClick(){
    this.auth.signOut().then(() => {
      this.zone.run(() => {
        this.isLoggedIn = false;
        this.userHasProfile = false;
        this.router.navigate(["/"]);
      });
    });
  }

  loggedIn(){
    return this.auth.isSignedIn();
  }

  onLoginClick(){
    this.loginSheet.open(AuthenticatorComponent);
  }
}

export interface UserDocument{
  publicName: string;
  description: string;
}
