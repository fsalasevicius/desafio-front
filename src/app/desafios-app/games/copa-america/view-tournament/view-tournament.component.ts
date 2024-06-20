import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CopaAmericaService } from 'src/app/services/copa-america.service';


@Component({
  selector: 'app-view-tournament',
  templateUrl: './view-tournament.component.html',
  styleUrls: ['./view-tournament.component.scss']
})
export class ViewTournamentComponent implements OnInit {
  joinForm!: FormGroup;
  user: any = undefined;
  loading: boolean = true;
  public token = localStorage.getItem('authToken');
  invitations: any[] = [];
  public tournamentName = "";
  constructor(
    private fb: FormBuilder,
    private _copaAmericaService: CopaAmericaService
  ) {
    if (this.token) {
      let obj_lc: any = localStorage.getItem('userData');
      this.user = JSON.parse(obj_lc);
    }
   }

  
   ngOnInit(): void {
    this.loadInvitations();
  }

  loadInvitations(): void {
    this.loading = true;
    if (this.user && this.user.email) {
      const email = this.user.email;
      this._copaAmericaService.getParticipantTournament({ email }, this.token).subscribe(
        (response) => {
          this.invitations = response;
          this.loading = false;
        },
        (error) => {
          this.loading = true;
          console.error('Error al obtener las invitaciones:', error);
          this.loading = false;
        }
      );
    }
  }

  sendWhatsAppInvitation(tournament:any) {
    const invitationText = this.generateInvitationText(tournament);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(invitationText)}`;
    window.open(whatsappUrl, '_blank');
  }
  
  generateInvitationText(tournament:any): string {
    const userName = this.user.name ? `${this.user.name},  ${this.user.surname}` : 'Un amigo';
    const invitationMessage = `¡Hola!\n${userName} te invita a participar de su torneo de amigos: '${tournament.tournamentName}' en Desafíos App. Crea tu cuenta en https://www.desafios.com.ar y empieza a divertirte con tus amigos.\nPara acceder al torneo después de ingresar con tu usuario, dirígete al siguiente enlace https://www.desafios.com.ar/games-copa-america-search-tournament , busca el \nTorneo: ${tournament.tournamentName}\nContraseña: ${tournament.password}`;
    return invitationMessage;
  }
  
}