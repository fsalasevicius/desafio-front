import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './desafios-app/Home/Home/home.component';
import { SignInMainComponent } from './desafios-app/sign-in/sign-in-main/sign-in-main.component';
import { SignUpMainComponent } from './desafios-app/sign-up/sign-up-main/sign-up-main.component';
import { ErrorPageComponent } from './desafios-app/error-page/error-page.component';
import { ContactMainComponent } from './desafios-app/contact/contact-main/contact-main.component';
import { CopaAmericaComponent } from './desafios-app/games/copa-america/copa-america.component';
import { AuthGuard } from './guard/auth.guard';
import { CuadroGrupoComponent } from './desafios-app/games/copa-america/cuadro-grupo/cuadro-grupo.component';
import { FriendsTournamentComponent } from './desafios-app/games/copa-america/friends-tournament/friends-tournament.component';
import { JoinTournamentComponent } from './desafios-app/games/copa-america/join-tournament/join-tournament.component';
import { TournamentDetailComponent } from './desafios-app/games/copa-america/tournament-detail/tournament-detail.component';
import { CuadroSimulacionComponent } from './desafios-app/games/copa-america/cuadro-simulacion/cuadro-simulacion.component';
import { Copaamerica2024comosejuegaComponent } from './desafios-app/como-se-juega/copaamerica2024comosejuega/copaamerica2024comosejuega.component';
import { TournamentConfigComponent } from './desafios-app/games/copa-america/tournament-config/tournament-config.component';
import { ProfileUserComponent } from './desafios-app/user/profile-user/profile-user.component';
import { PredictionComponent } from './desafios-app/games/copa-america/prediction/prediction.component';
import { ViewTournamentComponent } from './desafios-app/games/copa-america/view-tournament/view-tournament.component';
import { SearchTournamentComponent } from './desafios-app/games/copa-america/search-tournament/search-tournament.component';
import { UnauthorizedTournamentComponent } from './desafios-app/games/copa-america/tournament-config/unauthorized-tournament/unauthorized-tournament.component';
import { TopTresComponent } from './desafios-app/games/copa-america/prediction/top-tres/top-tres.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'games-copa-america-prediction',
    component: PredictionComponent, canActivate: [AuthGuard]
  },
  {
    path: 'games-copa-america',
    component: CopaAmericaComponent, canActivate: [AuthGuard]
  },
  {
    path: 'games-top-tres',
    component: TopTresComponent, canActivate: [AuthGuard]
  },
  {
    path: 'games-copa-america-como-jugar',
    component: Copaamerica2024comosejuegaComponent
  },
  {
    path: 'games-config-tournament/:id',
    component: TournamentConfigComponent, canActivate: [AuthGuard]
  },
  {
    path: 'unauthorized-tournament',
    component: UnauthorizedTournamentComponent, canActivate: [AuthGuard]
  },
  {
    path: 'games-copa-america-create-tournament',
    component: FriendsTournamentComponent, canActivate: [AuthGuard]
  },
  {
    path: 'games-copa-america-view-tournament',
    component: ViewTournamentComponent, canActivate: [AuthGuard]
  },
  {
    path: 'games-copa-america-search-tournament',
    component: SearchTournamentComponent, canActivate: [AuthGuard]
  },
  {
    path: 'games-copa-america-join-tournament',
    component: JoinTournamentComponent, canActivate: [AuthGuard]
  },
  {
    path: 'user-profile/:id',
    component: ProfileUserComponent, canActivate: [AuthGuard]
  },
  {
    path: 'tournament-detail/:id',
    component: TournamentDetailComponent, canActivate: [AuthGuard]
  },
  {
    path: 'sign-in',
    component: SignInMainComponent
  },
  {
    path: 'sign-up',
    component: SignUpMainComponent
  },
  {
    path: 'error',
    component: ErrorPageComponent
  },
  // {
  //   path: 'contact',
  //   component: ContactMainComponent
  // },
  {
    path: '**', pathMatch: 'full',
    component: ErrorPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
