import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { Message } from '../../entities/message';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from 'rxjs/Rx';
import { Adresse } from "../../shared/adresse";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  //messages: Message[];
  messages: Observable<Message[]>;
  id: string;
  ipAdress: string = Adresse.ip;
  type = true;
  constructor(private messageService: MessageService, private route: ActivatedRoute,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['username'];
      this.messages = this.messageService.getMessagesAsync(this.id, 'received');
    });
    /*this.messageService.messageSubject.subscribe(
      data => {
        this.messages = data;
      }
    );*/
  }
  getMessages() {
    if (this.type) {
      this.messages = this.messageService.getMessagesAsync(this.id, 'received');
    } else {
      this.messages = this.messageService.getMessagesAsync(this.id, 'sent');
    }
  }
  downloadFile(filename: string) {
    if (this.type) {
      const lien = this.ipAdress + '/files/' + this.authenticationService.getUserName()+ '/' + filename;
      window.open(lien, '_blank');
    } else {
      const lien =this.ipAdress +'/files/'+ this.id + '/' + filename;
      window.open(lien, '_blank');
    }
  }
}
