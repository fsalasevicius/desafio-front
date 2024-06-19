import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CopaAmericaService } from 'src/app/services/copa-america.service';
import { MessageService } from 'primeng/api';

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
    private _copaAmericaService: CopaAmericaService,
    private _messageService: MessageService
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
          this.invitations = response.invitations || [];
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          console.error('Error al obtener las invitaciones:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al obtener las invitaciones'
          });
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
        this._messageService.add({
          severity: 'success',
          summary: 'Proceso Exitoso!',
          detail: response.message
        });
      },
      (error) => {
        console.error('Error al unirse al torneo:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al unirse al torneo'
        });
      }
    );
  }
}