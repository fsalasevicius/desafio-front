import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CopaAmericaService } from 'src/app/services/copa-america.service';

@Component({
  selector: 'app-tournament-config',
  templateUrl: './tournament-config.component.html',
  styleUrls: ['./tournament-config.component.scss'],
  providers: [MessageService]
})
export class TournamentConfigComponent implements OnInit {
  tournamentId: string | undefined;
  loggedInUserId: string | undefined;
  public token = localStorage.getItem('authToken');
  user: any = undefined;
  isOwner: boolean = false;
  tournament: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private _copaAmericaService: CopaAmericaService,
  ) {
    if (this.token) {
      let obj_lc: any = localStorage.getItem('userData');
      this.user = JSON.parse(obj_lc);
    }
  }

  ngOnInit(): void {
    this.tournamentId = this.route.snapshot.params['id'];
    this.loggedInUserId = this.user?._id;

    const requestData = {
      tournamentId: this.tournamentId,
      userId: this.loggedInUserId
    };

    this._copaAmericaService.getTournamentId(requestData, this.token).subscribe(
      response => {
        if (response.success) {
          this.tournament = response.tournament;
          this.isOwner = this.tournament.owner._id === this.user._id;

          if (!this.isOwner) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No tienes permiso para acceder a este torneo',
            });
            this.router.navigate(['/unauthorized-tournament']);
          }
        }
      },
      error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No tienes permiso para acceder a este torneo',
        });
        this.router.navigate(['/unauthorized-tournament']);
      }
    );
  }
  sendWhatsAppInvitation() {
    const invitationText = this.generateInvitationText();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(invitationText)}`;
    window.open(whatsappUrl, '_blank');
  }
  
  generateInvitationText(): string {
    const userName = this.user.name ? `${this.user.name},  ${this.user.surname}` : 'Un amigo';
    const invitationMessage = `¡Hola!\n${userName} te invita a participar de su torneo de amigos: '${this.tournament.tournamentName}' en Desafíos App. Crea tu cuenta en https://www.desafios.com.ar y empieza a divertirte con tus amigos.\nPara acceder al torneo después de ingresar con tu usuario, dirígete al siguiente enlace https://www.desafios.com.ar/games-copa-america-search-tournament , busca el \nTorneo: ${this.tournament.tournamentName}\nContraseña: ${this.tournament.password}`;
    return invitationMessage;
  }
}