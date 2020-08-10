import { RouterModule, Routes } from '@angular/router';

import { AccueilComponent } from './accueil/accueil.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { LogoutComponent } from './logout/logout.component';
import { ForumComponent } from './forum/forum.component';
import { CloudComponent } from './cloud/cloud.component';
import { MessagingComponent } from './messaging/messaging.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth-guard';
import { MessagesComponent } from './messaging/messages/messages.component';
import { SendComponent } from './messaging/send/send.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { ViewerComponent } from './viewer/viewer.component';
import { AnonymizerComponent } from './anonymizer/anonymizer.component';
import { BrowseComponent } from './browse/browse.component';
import { EmptyComponent } from './messaging/empty/empty.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/profile',
        pathMatch: 'full'
    },
    {
        path: 'accueil',
        component: AccueilComponent
    },
    {
        path: 'subscribe',
        component: SubscriptionComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'forum',
        component: ForumComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'cloud',
        component: CloudComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'users',
        component: BrowseComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'viewer',
        component: ViewerComponent
    },
    {
        path: 'anonymizer',
        component: AnonymizerComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'message',
        component: MessagingComponent,
        children: [
            { path: '', redirectTo: 'empty', pathMatch: 'full' },
            { path: 'messages/:username', component: MessagesComponent },
            { path: 'send/:username', component: SendComponent },
            { path: 'empty', component: EmptyComponent }
        ],
        canActivate: [AuthGuard]
    },
    {
        path: 'logout',
        component: LogoutComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: '/profile'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
