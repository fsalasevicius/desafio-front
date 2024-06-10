import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './educal/Home/Home/home.component';
import { CoursesPageComponent } from './educal/courses/courses-page/courses-page.component';
import { CoursesListPageComponent } from './educal/courses-list-page/courses-list-main/courses-list-page.component';
import { CourseSidebarMainComponent } from './educal/course-sidebar/course-sidebar-main/course-sidebar-main.component';
import { CourseDetailsComponent } from './educal/course-details/course-details-main/course-details.component';
import { BlogComponent } from './educal/blog/blog-main/blog.component';
import { BlogDetailsMainComponent } from './educal/blog-details/blog-details-main/blog-details-main.component';
import { AboutMainComponent } from './educal/about/about-main/about-main.component';
import { InstructorMainComponent } from './educal/instructor/instructor-main/instructor-main.component';
import { InstructorDetailsComponent } from './educal/instructor-details/instructor-details-main/instructor-details.component';
import { EventDetailsMainComponent } from './educal/event-details/event-details-main/event-details-main.component';
import { SignInMainComponent } from './educal/sign-in/sign-in-main/sign-in-main.component';
import { SignUpMainComponent } from './educal/sign-up/sign-up-main/sign-up-main.component';
import { ErrorPageComponent } from './educal/error-page/error-page.component';
import { ContactMainComponent } from './educal/contact/contact-main/contact-main.component';
import { CopaAmericaComponent } from './educal/games/copa-america/copa-america.component';
import { AuthGuard } from './guard/auth.guard';
import { RegisterComponent } from './educal/register/register.component';
import { CuadroGrupoComponent } from './educal/games/copa-america/cuadro-grupo/cuadro-grupo.component';



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
    path: 'games-simulacion-tabla',
    component: CuadroGrupoComponent, canActivate: [AuthGuard]
  },
  {
    path: 'blog',
    component: BlogComponent
  },
  {
    path: 'blog-details',
    component: BlogDetailsMainComponent
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
