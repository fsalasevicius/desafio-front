import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './desafios-app/Home/Home/home.component';
import { CoursesPageComponent } from './desafios-app/courses/courses-page/courses-page.component';
import { CoursesListPageComponent } from './desafios-app/courses-list-page/courses-list-main/courses-list-page.component';
import { CourseSidebarMainComponent } from './desafios-app/course-sidebar/course-sidebar-main/course-sidebar-main.component';
import { CourseDetailsComponent } from './desafios-app/course-details/course-details-main/course-details.component';
import { AboutMainComponent } from './desafios-app/about/about-main/about-main.component';
import { InstructorMainComponent } from './desafios-app/instructor/instructor-main/instructor-main.component';
import { InstructorDetailsComponent } from './desafios-app/instructor-details/instructor-details-main/instructor-details.component';
import { EventDetailsMainComponent } from './desafios-app/event-details/event-details-main/event-details-main.component';
import { SignInMainComponent } from './desafios-app/sign-in/sign-in-main/sign-in-main.component';
import { SignUpMainComponent } from './desafios-app/sign-up/sign-up-main/sign-up-main.component';
import { ErrorPageComponent } from './desafios-app/error-page/error-page.component';
import { ContactMainComponent } from './desafios-app/contact/contact-main/contact-main.component';
import { CopaAmericaComponent } from './desafios-app/games/copa-america/copa-america.component';
import { AuthGuard } from './guard/auth.guard';
import { RegisterComponent } from './desafios-app/register/register.component';
import { CuadroGrupoComponent } from './desafios-app/games/copa-america/cuadro-grupo/cuadro-grupo.component';
import { FriendsTournamentComponent } from './desafios-app/games/copa-america/friends-tournament/friends-tournament.component';
import { JoinTournamentComponent } from './desafios-app/games/copa-america/join-tournament/join-tournament.component';
import { TournamentDetailComponent } from './desafios-app/games/copa-america/tournament-detail/tournament-detail.component';
import { CuadroSimulacionComponent } from './desafios-app/games/copa-america/cuadro-simulacion/cuadro-simulacion.component';
import { Copaamerica2024comosejuegaComponent } from './desafios-app/como-se-juega/copaamerica2024comosejuega/copaamerica2024comosejuega.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'courses',
    component: CoursesPageComponent
  },
  {
    path: 'courses-list',
    component: CoursesListPageComponent
  },
  {
    path: 'courses-sidebar',
    component: CourseSidebarMainComponent
  },
  {
    path: 'course-details',
    component: CourseDetailsComponent
  },
  {
    path: 'games-copa-america',
    component: CopaAmericaComponent, canActivate: [AuthGuard]
  },
  {
    path: 'games-copa-america-como-jugar',
    component: Copaamerica2024comosejuegaComponent
  },
  {
    path: 'games-tabla-real',
    component: CuadroGrupoComponent
  },
  {
    path: 'games-copa-america-create-tournament',
    component: FriendsTournamentComponent, canActivate: [AuthGuard]
  },
  {
    path: 'games-copa-america-join-tournament',
    component: JoinTournamentComponent, canActivate: [AuthGuard]
  },
  {
    path: 'tournament-detail/:id',
    component: TournamentDetailComponent, canActivate: [AuthGuard]
  },
  
  {
    path: 'games-simulacion-tabla',
    component: CuadroSimulacionComponent, canActivate: [AuthGuard]
  },
  {
    path: 'about',
    component: AboutMainComponent
  },
  {
    path: 'instructor',
    component: InstructorMainComponent
  },
  {
    path: 'instructor-details',
    component: InstructorDetailsComponent
  },
  {
    path: 'event-details',
    component: EventDetailsMainComponent
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
  {
    path: 'contact',
    component: ContactMainComponent
  },
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
