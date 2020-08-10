import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';

import { UserService } from './services/user.service';
import { AccueilComponent } from './accueil/accueil.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AuthenticationService } from './services/authentication.service';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './guards/auth-guard';
import { LogoutComponent } from './logout/logout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TokenInterceptor } from './guards/tokenInterceptor';
import { ForumComponent } from './forum/forum.component';
import { CloudComponent } from './cloud/cloud.component';
import { MessagingComponent } from './messaging/messaging.component';
import {MessageService} from './services/message.service';
import {CloudService} from './services/cloud.service';
import {ForumService} from './services/forum.service';
import { MessagesComponent } from './messaging/messages/messages.component';
import { SendComponent } from './messaging/send/send.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { ViewerComponent } from './viewer/viewer.component';
import { AnonymizerComponent } from './anonymizer/anonymizer.component';
import { FileService } from './services/file.service';
import { CommentService } from './services/comment.service';
import { BrowseComponent } from './browse/browse.component';
import { EmptyComponent } from './messaging/empty/empty.component';
import { FileUploadService } from "./services/file-upload.service";

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    AccueilComponent,
    LoginComponent,
    LogoutComponent,
    NavbarComponent,
    ForumComponent,
    CloudComponent,
    MessagingComponent,
    MessagesComponent,
    SendComponent,
    SubscriptionComponent,
    ViewerComponent,
    AnonymizerComponent,
    BrowseComponent,
    EmptyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    AngularFontAwesomeModule
  ],
  providers: [
    UserService,
    AuthenticationService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    MessageService,
    CloudService,
    ForumService,
    FileService,
    CommentService,
    FileUploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
