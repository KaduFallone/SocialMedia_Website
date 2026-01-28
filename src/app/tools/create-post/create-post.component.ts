import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSStorage } from   'firebasets/firebasetsStorage/firebaseTSStorage'
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  auth= new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  storage = new FirebaseTSStorage();

  selectedImageFile?: File;
  imageSrc?: string;

  constructor(private dialog: MatDialogRef<CreatePostComponent>) { }

  ngOnInit(): void {
  }

  onPostClick(commentInput: HTMLTextAreaElement){
    let comment = commentInput.value;
    if (comment.length <= 0 ) return;
    if(this.selectedImageFile){
      this.upLoadImagePost(comment);
    }
    else{
      this.uploadPost(comment);
    }
  }

  upLoadImagePost(comment: string){
    let postId = this.firestore.genDocId();
    this.storage.upload(
      {
        uploadName: "upload Image post",
        path: ["Post", postId, "image"],
        data:{
          data: this.selectedImageFile
        },
        onComplete: (dowloadUrl) => {
          this.firestore.create(
            {
              path: ["Post", postId],
              data:{
                comment:comment,
                creatorId: this.auth.getAuth().currentUser!.uid,
                imageURL: dowloadUrl,
                timeStamp:  FirebaseTSApp.getFirestoreTimestamp()
              },
              onComplete: (docId) => {
                this.dialog.close();
              }
            }
          );
        },
      }
    );
  }

  uploadPost(comment: string){
    this.firestore.create(
      {
        path: ["Post"],
        data:{
          comment:comment,
          creatorId: this.auth.getAuth().currentUser!.uid,
          timeStamp:  FirebaseTSApp.getFirestoreTimestamp()
        },
        onComplete: (docId) => {
          this.dialog.close();
        }
      }
    );
  }

  onPhotoSelected(photoSelector: HTMLInputElement){
    if(photoSelector.files && photoSelector.files[0]){
      this.selectedImageFile = photoSelector.files[0];

      let fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedImageFile);
      fileReader.addEventListener(
        "loadend",
        ev => {
          let readableString = fileReader.result?.toString();
          let postPreviewImage = <HTMLImageElement>document.getElementById("post-preview-image");
          if(readableString){
            postPreviewImage.src = readableString;
          }
        }
      )
    }
  }

}
