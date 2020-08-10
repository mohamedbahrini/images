import { Component, OnInit } from '@angular/core';
import {MessageService} from '../services/message.service';
import {Message} from '../entities/message';
import {User} from '../entities/user';
import { UserService } from '../services/user.service';
import { error } from 'selenium-webdriver';

import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {
  getinfos = false;
  getusers = false;
  loading = false;
  message: Message;
  users: Observable<User[]>;
  favorits: Observable<User[]>;
  userInfos: User;
  constructor(private messageService: MessageService, private userService: UserService) { }

  ngOnInit() {
   
    this.users = this.messageService.getUsers();
    this.loading = true;

    this.userService.getInfo().subscribe(
      data => {
        this.userInfos = data;
        console.log('added');
      }
    );

    this.favorits = this.userService.getFavorits();
    
  }

  public addFavorite(username: string) {
    console.log('adding '+username);
    this.favorits = this.userService.addFavorite(username); 
  }
  public deleteFavorite(username: string) {
    console.log('deleting '+username);
    this.favorits = this.userService.deleteFavorite(username);
  }
}
