import { Component, OnInit, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from 'src/app/tools/create-post/create-post.component';
import { FirebaseTSFirestore, Limit, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css']
})
export class PostFeedComponent implements OnInit {
  firestore = new FirebaseTSFirestore;
  posts: PostData [] = [];
  constructor(
    private dialog: MatDialog,
    private zone: NgZone
) { }

  ngOnInit(): void {
    this.getPosts();
  }

  onCreatePostClick(){
    this.dialog.open(CreatePostComponent)
  }

  getPosts(){
    this.firestore.getCollection(
      {
        path: ["Post"],
        where: [
          new OrderBy("timeStamp", "desc"),
          new Limit(10)
        ],
        onComplete: (result) => {
          this.zone.run(() => {
            this.posts = [];
            console.log("Documentos brutos no Firebase: ", result.docs.length);
            result.docs.forEach(doc => {
              let post = <PostData>doc.data();
              post.postId = doc.id
              this.posts.push(post);
           });
          });
        },
        onFail: err => {
          console.error("Erro ao buscar posts:", err);
        }
      }
    )
  }

}

export interface PostData{
  comment: string;
  creatorId: string;
  imageURL: string;
  postId: string
}