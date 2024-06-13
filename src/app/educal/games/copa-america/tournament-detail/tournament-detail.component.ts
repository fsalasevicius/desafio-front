import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CopaAmericaService } from 'src/app/services/copa-america.service';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-tournament-detail',
  templateUrl: './tournament-detail.component.html',
  styleUrls: ['./tournament-detail.component.scss'],
})
export class TournamentDetailComponent implements OnInit {
  user: any = undefined;
  public id = '';
  public tournamentName = '';
  selectedUser: any;
  public owner = '';
  public load_data = false;
  public token = localStorage.getItem('authToken');
  invitations: any[] = [];
  public userPoints: any = {};
  public displayPointsDetailModal: boolean = false;
  public display: boolean | undefined;
  constructor(
    private _route: ActivatedRoute,
    private _copaAmericaService: CopaAmericaService,
    public dialogService: DialogService
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

      // Llamar a calculatePoints cuando se carguen los detalles del torneo
      this.calculatePoints();

      this._copaAmericaService
        .getParticipantsTournament(this.id, this.token)
        .subscribe(
          (response) => {
            this.invitations = response.participants;

          
          console.log('Invitaciones ordenadas:', this.invitations);
            this.tournamentName = response.tournamentName;
            this.owner = response.owner.surname + ' ' + response.owner.name;

            console.log('Detalle de torneos', this.invitations);
          },
          (error) => {
            console.error('Error al obtener las invitaciones:', error);
          }
        );
    });
  }

  calculatePoints(): void {
    let id = this.id;
    this._copaAmericaService.calculatePoints({ id }, this.token).subscribe(
      (response) => {
        this.userPoints = response.userPoints;
        this.invitations.sort((a, b) => {
          return this.userPoints[b._id] - this.userPoints[a._id];
      });
      },
      (error) => {
        console.error('Error al recalcular puntos:', error);
      }
    );
  }

  showPointsDetail(user: any) {
    this.selectedUser = user;
    this.display = true;
}
}



