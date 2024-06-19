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
  checkIcon: any;
  public tournamentName = '';
  selectedUser: any;
  public owner = '';
  loading = true;
  public load_data = false;
  public token = localStorage.getItem('authToken');
  invitations: any[] = [];
  userPredictions: any[] = [];
  public userPoints: any = {};
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

      this.calculatePoints();

      this._copaAmericaService
        .getParticipantsTournament(this.id, this.token)
        .subscribe(
          (response) => {
            this.invitations = response.participants;
            this.userPredictions = response.userPredictionDetails;
            this.tournamentName = response.tournamentName;
            this.owner = response.owner.surname + ' ' + response.owner.name;
          },
          (error) => {
            console.error('Error al obtener las invitaciones:', error);
          }
        );
    });
  }

  getDialogWidth(): string {
    if (window.innerWidth <= 576) { // Dispositivos móviles extra pequeños
      return '90vw'; // Ancho del modal en porcentaje
    } else if (window.innerWidth <= 768) { // Dispositivos móviles y tablets
      return '70vw'; // Ancho del modal en porcentaje
    } else {
      return '30vw'; // Ancho del modal en porcentaje
    }
  }
  
  calculatePoints(): void {
    this.loading = true;
    let id = this.id;
    this._copaAmericaService.calculatePoints({ id }, this.token).subscribe(
      (response) => {
        this.userPoints = response.userPoints;
        this.userPredictions = response.userPredictionDetails; // Guardamos las predicciones
        this.invitations.sort((a, b) => {
          return this.userPoints[b._id] - this.userPoints[a._id];
      });
        this.loading = false;
      },
      (error) => {
        this.loading = true;
        console.error('Error al recalcular puntos:', error);
        this.loading = false;
      }
    );
  }

  showPointsDetail(user: any) {
    this.selectedUser = {
      ...user,
      matches: this.userPredictions[user._id] || []
    };
    this.display = true;
  }
}



