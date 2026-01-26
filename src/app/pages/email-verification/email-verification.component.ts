import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  auth = new FirebaseTSAuth();

  constructor(private router: Router) { }

  ngOnInit(): void {
  const user = this.auth.getAuth().currentUser;
  console.log("Componente de Verificação: Usuário atual ->", user?.email);
  console.log("Email verificado?", user?.emailVerified);

  if(this.auth.isSignedIn() && !user?.emailVerified) {
    this.auth.sendVerificaitonEmail();
    console.log("Email enviado.");
  } else {
    console.log("Lógica do componente expulsando para a Home...");
    this.router.navigate(["/"]);
  }
}

  onResendClick(){
    this.auth.sendVerificaitonEmail();
  }

}
