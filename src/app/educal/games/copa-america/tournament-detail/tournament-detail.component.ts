import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CopaAmericaService } from 'src/app/services/copa-america.service';

@Component({
  selector: 'app-tournament-detail',
  templateUrl: './tournament-detail.component.html',
  styleUrls: ['./tournament-detail.component.scss']
})
export class TournamentDetailComponent implements OnInit {
  user: any = undefined;
  public id = '';
  public tournamentName = '';
  public owner = '';
  public load_data = false;
  public token = localStorage.getItem('authToken');
  invitations: any[] = [];

  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private _copaAmericaService: CopaAmericaService
  ) {
    if (this.token) {
      let obj_lc: any = localStorage.getItem('userData');
      this.user = JSON.parse(obj_lc);
    }
   }

  
   ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.load_data = true;
        this._copaAmericaService.getParticipantsTournament(this.id, this.token).subscribe(
          (response) => {
            this.invitations = response.participants;
            this.tournamentName = response.tournamentName;
            this.owner = response.owner.surname + " " + response.owner.name

            console.log('Detalle de torneos', this.invitations);
          },
          (error) => {
            console.error('Error al obtener las invitaciones:', error);
          }
        );
    });
  }


}
