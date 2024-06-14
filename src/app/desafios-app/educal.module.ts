import { NgModule,CUSTOM_ELEMENTS_SCHEMA,LOCALE_ID } from '@angular/core';
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { SwiperModule } from 'swiper/angular';
import { HomeComponent } from './Home/Home/home.component';
import { HeroComponent } from './Home/hero/hero.component';
import { CategoryComponent } from './Home/category/category.component';
import { BannerAreaComponent } from './Home/banner-area/banner-area.component';
import { CoursesComponent } from './Home/courses/courses.component';
import { EventsComponent } from './Home/events/events.component';
import { PricingComponent } from './Home/pricing/pricing.component';
import { CtaComponent } from './Home/cta/cta.component';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderTwoComponent } from './common/header/header.component';
import { AboutAreaComponent } from './common/about-area/about-area.component';
import { BrandAreaComponent } from './common/brand-area/brand-area.component';
import { CoursesPageComponent } from './courses/courses-page/courses-page.component';
import { BreadcrumbComponent } from './common/breadcrumb/breadcrumb.component';
import { CourseGridComponent } from './common/course-grid/course-grid.component';
import { CourseListComponent } from './common/course-list/course-list.component';
import { CoursesPageCoursesAreaComponent } from './courses/courses-page-courses-area/courses-page-courses-area.component';
import { PaginationComponent } from './common/pagination/pagination.component';
import { CoursesListPageComponent } from './courses-list-page/courses-list-main/courses-list-page.component';
import { CoursesListAreaComponent } from './courses-list-page/courses-list-area/courses-list-area.component';
import { CourseSidebarMainComponent } from './course-sidebar/course-sidebar-main/course-sidebar-main.component';
import { CourseSidebarAreaComponent } from './course-sidebar/course-sidebar-area/course-sidebar-area.component';
import { RelatedCourseComponent } from './common/related-course/related-course.component';
import { CourseDetailsComponent } from './course-details/course-details-main/course-details.component';
import { CourseDetailsAreaComponent } from './course-details/course-details-area/course-details-area.component';
import { BlogSidebarComponent } from './common/blog-sidebar/blog-sidebar.component';
import { AboutMainComponent } from './about/about-main/about-main.component';
import { InstructorMainComponent } from './instructor/instructor-main/instructor-main.component';
import { InstructorAreaComponent } from './instructor/instructor-area/instructor-area.component';
import { InstructorDetailsComponent } from './instructor-details/instructor-details-main/instructor-details.component';
import { InstructorDetailsAreaComponent } from './instructor-details/instructor-details-area/instructor-details-area.component';
import { EventDetailsMainComponent } from './event-details/event-details-main/event-details-main.component';
import { EventDetailsAreaComponent } from './event-details/event-details-area/event-details-area.component';
import { EventDetailsTitleComponent } from './event-details/event-details-title/event-details-title.component';
import { SignInMainComponent } from './sign-in/sign-in-main/sign-in-main.component';
import { SignInAreaComponent } from './sign-in/sign-in-area/sign-in-area.component';
import { SignUpMainComponent } from './sign-up/sign-up-main/sign-up-main.component';
import { SignUpAreaComponent } from './sign-up/sign-up-area/sign-up-area.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ContactMainComponent } from './contact/contact-main/contact-main.component';
import { ContactAreaComponent } from './contact/contact-area/contact-area.component';
import { ContactInfoComponent } from './contact/contact-info/contact-info.component';
import { CopaAmericaComponent } from './games/copa-america/copa-america.component';
import { CuadroGrupoComponent } from './games/copa-america/cuadro-grupo/cuadro-grupo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { PrimeNgModule } from './common/primeng/primeng.module';
import { FriendsTournamentComponent } from './games/copa-america/friends-tournament/friends-tournament.component';
import { JoinTournamentComponent } from './games/copa-america/join-tournament/join-tournament.component';
import { TournamentDetailComponent } from './games/copa-america/tournament-detail/tournament-detail.component';
import { CuadroSimulacionComponent } from './games/copa-america/cuadro-simulacion/cuadro-simulacion.component';
import { Copaamerica2024comosejuegaComponent } from './como-se-juega/copaamerica2024comosejuega/copaamerica2024comosejuega.component';
import { SpinnerComponent } from './common/spinner/spinner.component';
import { TournamentConfigComponent } from './games/copa-america/tournament-config/tournament-config.component';
import { CountdownComponent } from './Home/category/countdown/countdown.component';

registerLocaleData(localeEsAr);

@NgModule({
  declarations: [
    HomeComponent,
    HeroComponent,
    CategoryComponent,
    BannerAreaComponent,
    CoursesComponent,
    EventsComponent,
    PricingComponent,
    CtaComponent,
    FooterComponent,
    HeaderTwoComponent,
    AboutAreaComponent,
    BrandAreaComponent,
    CoursesPageComponent,
    BreadcrumbComponent,
    CourseGridComponent,
    CourseListComponent,
    CoursesPageCoursesAreaComponent,
    PaginationComponent,
    CoursesListPageComponent,
    CoursesListAreaComponent,
    CourseSidebarMainComponent,
    CourseSidebarAreaComponent,
    RelatedCourseComponent,
    CourseDetailsComponent,
    CopaAmericaComponent,
    CourseDetailsAreaComponent,
    BlogSidebarComponent,
    AboutMainComponent,
    InstructorMainComponent,
    InstructorAreaComponent,
    InstructorDetailsComponent,
    InstructorDetailsAreaComponent,
    EventDetailsMainComponent,
    EventDetailsAreaComponent,
    EventDetailsTitleComponent,
    SignInMainComponent,
    SignInAreaComponent,
    SignUpMainComponent,
    SignUpAreaComponent,
    ErrorPageComponent,
    ContactMainComponent,
    ContactAreaComponent,
    ContactInfoComponent,
    CuadroGrupoComponent,
    RegisterComponent,
    FriendsTournamentComponent,
    JoinTournamentComponent,
    TournamentDetailComponent,
    CuadroSimulacionComponent,
    Copaamerica2024comosejuegaComponent,
    SpinnerComponent,
    TournamentConfigComponent,
    CountdownComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    PrimeNgModule,
    SwiperModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-AR' }
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EducalModule { }
