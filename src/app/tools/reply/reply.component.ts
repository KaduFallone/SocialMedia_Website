import { Component, OnInit } from '@angular/core';
import { FirebaseTSFirestore, OrderBy } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject, NgZone} from '@angular/core';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {
  firestore = new FirebaseTSFirestore;
  comments: Comment [] = [];
  constructor(
    @Inject (MAT_DIALOG_DATA) private postId: string,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.getComments();
  }

  isCommentCreator(comment: Comment){
      return comment.creatorId == AppComponent.getUserDocument()?.userId;
  }

  getComments(){
    this.firestore.listenToCollection(
      {
        name: "Post Comments",
        path: ["Post", this.postId, "PostComment"],
        where: [new OrderBy("timeStamp", "asc")],
        onUpdate: (result) =>{
          this.zone.run(() => {
            let tempComments: Comment[] = [];
            result.docs.forEach(
              doc => {
                let commentData = doc.data() as Comment;
                tempComments.push(commentData);
                this.comments = tempComments.reverse();
                console.log("Comentários atualizados sem duplicatas!")
              }
            )
          })
        }
      }
    );
  }

  onSendClick(commentInput: HTMLInputElement){
    if(!(commentInput.value.length > 0)) return;
    this.firestore.create({
      path: ["Post", this.postId, "PostComment"],
      data: {
        comment: commentInput.value,
        creatorId: AppComponent.getUserDocument()?.userId,
        creatorName: AppComponent.getUserDocument()?.publicName,
        timeStamp: FirebaseTSApp.getFirestoreTimestamp()
      },
      onComplete: (docId) =>{
        commentInput.value = "";
      },
      onFail: (err) => {
        console.error("ERRO AO CRIAR COMENTÁRIO:", err);
        alert("Falha ao enviar: " + err);
      }
    });
  } 

}

export interface Comment{
  creatorId: string;
  creatorName: string;
  comment: string;
  timeStamp: any;
}
