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
import { CtaComponent } from './Home/cta/cta.component';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderTwoComponent } from './common/header/header.component';
import { BlogSidebarComponent } from './common/blog-sidebar/blog-sidebar.component';
import { SignInMainComponent } from './sign-in/sign-in-main/sign-in-main.component';
import { SignInAreaComponent } from './sign-in/sign-in-area/sign-in-area.component';
import { SignUpMainComponent } from './sign-up/sign-up-main/sign-up-main.component';
import { SignUpAreaComponent } from './sign-up/sign-up-area/sign-up-area.component';
import { ErrorPageComponent } from './error-page/error-page.component';
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
import { ProfileUserComponent } from './user/profile-user/profile-user.component';
import { UserDataFormComponent } from './user/profile-user/user-data-form/user-data-form.component';
import { UserSegurityFormComponent } from './user/profile-user/user-segurity-form/user-segurity-form.component';
import { UserNotificationFormComponent } from './user/profile-user/user-notification-form/user-notification-form.component';
import { UserTournamentFormComponent } from './user/profile-user/user-tournament-form/user-tournament-form.component';
import { PredictionComponent } from './games/copa-america/prediction/prediction.component';
import { ViewTournamentComponent } from './games/copa-america/view-tournament/view-tournament.component';
import { SearchTournamentComponent } from './games/copa-america/search-tournament/search-tournament.component';
import { UnauthorizedTournamentComponent } from './games/copa-america/tournament-config/unauthorized-tournament/unauthorized-tournament.component';
import { FriendInvitationComponent } from './games/copa-america/tournament-config/friend-invitation/friend-invitation.component';
import { ConfigComponent } from './games/copa-america/tournament-config/config/config.component';
import { TopTresComponent } from './games/copa-america/prediction/top-tres/top-tres.component';

registerLocaleData(localeEsAr);

@NgModule({
  declarations: [
    HomeComponent,
    HeroComponent,
    CategoryComponent,
    CtaComponent,
    FooterComponent,
    HeaderTwoComponent,
    CopaAmericaComponent,
    BlogSidebarComponent,
    SignInMainComponent,
    SignInAreaComponent,
    SignUpMainComponent,
    SignUpAreaComponent,
    ErrorPageComponent,
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
    ProfileUserComponent,
    UserDataFormComponent,
    UserSegurityFormComponent,
    UserNotificationFormComponent,
    UserTournamentFormComponent,
    PredictionComponent,
    ViewTournamentComponent,
    SearchTournamentComponent,
    UnauthorizedTournamentComponent,
    FriendInvitationComponent,
    ConfigComponent,
    TopTresComponent,
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
