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
      this._copaAmericaService.getUserInvitations({ email }, this.token).subscribe(
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
  
}