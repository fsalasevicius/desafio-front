import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CopaAmericaService } from 'src/app/services/copa-america.service';
import { DialogService } from 'primeng/dynamicdialog';
interface Message {
  _id: string;
  userid: {
    _id: string;
    name: string;
    surname: string;
  };
  tournamentid: string;
  text: string;
  createdAt: Date;
}
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
  newMessage: string = '';
  messages: { userid: string, tournamentid:string, text: string, }[] = [];
  messagesView: Message[] = [];
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
        this._copaAmericaService.getMessageTournament(this.id, this.token).subscribe(
          (response) => {
            this.messagesView = response.messages;
          },
          (error) => {
            console.error('Error al obtener los mensajes:', error);
          }
        );
        this.calculatePoints();
    });
    
  }

  getDialogWidth(): string {
    if (window.innerWidth <= 576) { 
      return '90vw'; 
    } else if (window.innerWidth <= 768) { 
      return '70vw'; 
    } else {
      return '30vw'; 
    }
  }
  
  calculatePoints(): void {
    this.loading = true;
    let id = this.id;
    this._copaAmericaService.calculatePoints({ id }, this.token).subscribe(
      (response) => {
        this.userPoints = response.userPoints;
        this.userPredictions = response.userPredictionDetails; 
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

  submitMessage() {
    if (this.newMessage.trim() && this.user.name) {
      const message = {
        username: this.user.surname + ", " + this.user.name,
        userid: this.user._id,
        tournamentid: this.id,
        text: this.newMessage.trim()
      };
      this._copaAmericaService.createMessage(message, this.token).subscribe(
        (response) => {
          this.messages.push(response);
          this.newMessage = '';
          window.location.reload();
        },
        (error) => {
          console.error('Error al enviar el mensaje:', error);
        }
      );
    }
  }


}



