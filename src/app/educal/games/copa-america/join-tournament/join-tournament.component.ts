import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CopaAmericaService } from 'src/app/services/copa-america.service';

@Component({
  selector: 'app-join-tournament',
  templateUrl: './join-tournament.component.html',
  styleUrls: ['./join-tournament.component.scss']
})
export class JoinTournamentComponent implements OnInit { 
  joinForm!: FormGroup;
  user: any = undefined;
  public token = localStorage.getItem('authToken');
  invitations: any[] = [];
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
    if (this.user && this.user.email) {
      const email = this.user.email;
      this._copaAmericaService.getUserInvitations({ email }, this.token).subscribe(
        (response) => {
          this.invitations = response;
          console.log('Detalle de torneos', this.invitations);
        },
        (error) => {
          console.error('Error al obtener las invitaciones:', error);
        }
      );
    }
  }

  joinTournament(tournament: any): void {
    const password = prompt(`Introduce la contraseña para el torneo "${tournament.tournamentName}":`);

    if (password) {
      this._copaAmericaService.joinTournament(
        { tournamentName: tournament.tournamentName, userEmail: this.user.email, password },
        this.token
      ).subscribe(
        (response) => {
          console.log('Unido al torneo con éxito:', response);
          this.loadInvitations(); // Refresh the invitations list
        },
        (error) => {
          console.error('Error al unirse al torneo:', error);
        }
      );
    }
  }

  isPendingInvitation(tournament: any): boolean {
    return tournament.invitations.some((inv: any) => inv.email === this.user.email && inv.status === 'pending');
  }
  
}