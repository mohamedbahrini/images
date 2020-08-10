import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';
import { User } from '../entities/user';

import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
  users: Observable<User[]>;
  followers: Observable<number>;
  followings: Observable<number>;
  constructor(private messageService: MessageService, private userService: UserService) { }

  ngOnInit() {
    this.users = this.messageService.getUsers();
    this.followers = this.userService.getNumberFollowers();
    this.followings = this.userService.getNumberFollowings();
  }

  addFavorite(username: string) {
    console.log('adding ' + username);
    this.userService.addFavorite(username).subscribe(
      data => {
        console.log('success');
        console.log(data);

        this.followings = this.userService.getNumberFollowings();
      },
      error => {
        console.log(error);
      }
    );
  }
}
