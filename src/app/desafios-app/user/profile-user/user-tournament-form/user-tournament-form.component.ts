import { Component, OnInit } from '@angular/core';
import { CopaAmericaService } from 'src/app/services/copa-america.service';

@Component({
  selector: 'app-user-tournament-form',
  templateUrl: './user-tournament-form.component.html',
  styleUrls: ['./user-tournament-form.component.scss']
})
export class UserTournamentFormComponent implements OnInit {
  user: any = undefined;
  loading: boolean = true;
  public token = localStorage.getItem('authToken');
  invitations: any[] = [];
  public tournamentName = "";

  constructor(
    private _copaAmericaService: CopaAmericaService
  ) {
    if (this.token) {
      let obj_lc: any = localStorage.getItem('userData');
      this.user = JSON.parse(obj_lc);
      console.log('User data from localStorage:', this.user);
    }
  }

  loadInvitations(): void {
    this.loading = true;
    if (this.user && this.user.email) {
      const email = this.user.email;
      this._copaAmericaService.getUserInvitations({ email }, this.token).subscribe(
        (response) => {
          this.invitations = response
          console.log(this.invitations)
          this.loading = false;
        },
        (error) => {
          console.error('Error al obtener las invitaciones:', error);
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
      console.log('No user or email found');
    }
  }

  joinTournament(tournament: any): void {
    this._copaAmericaService.joinTournament(
      { tournamentName: tournament.tournamentName, userEmail: this.user.email },
      this.token
    ).subscribe(
      (response) => {
        this.loadInvitations(); 
      },
      (error) => {
        console.error('Error al unirse al torneo:', error);
      }
    );
}

isPendingInvitation(tournament: any): boolean {
  return tournament.invitations.some((inv: any) => inv.email === this.user.email && inv.status === 'pending');
}

  ngOnInit(): void {
    console.log('User:', this.user);
    this.loadInvitations();
    console.log('Invitations after loadInvitations:', this.invitations);
  }
}