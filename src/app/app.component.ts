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
          this.zone.run(() => this.router.navigate(["/"]));
        },
        whenSignedInAndEmailNotVerified: user => {
          console.log("LOG: Email não verificado via firebasets.");
          this.verificarEredirecionar(user);
        },
        whenSignedInAndEmailVerified: user => {
          this.getUserProfile();
          this.zone.run(() => this.router.navigate(["/"]));
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
    this.firestore.listenToDocument(
      {
        name: "Getting Document" ,
        path: ["Users", this.auth.getAuth().currentUser!.uid],
        onUpdate: (result) => {
          this.zone.run(() => { 
            this.userDocument = <UserDocument>result.data();
            this.userHasProfile = result.exists;
            console.log("LOG: Perfil existe? ", this.userHasProfile);
          });
        }
      }
    );
  }

  onLogoutClick(){
    this.auth.signOut();
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
