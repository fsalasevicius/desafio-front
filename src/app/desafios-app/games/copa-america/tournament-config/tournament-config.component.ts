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
          console.log(this.tournament)
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
}